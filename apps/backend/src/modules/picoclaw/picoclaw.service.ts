import { Injectable, Logger } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class PicoclawService {
  private readonly logger = new Logger(PicoclawService.name);

  chatStream(
    userId: string,
    prompt: string,
    signal: AbortSignal,
  ): Observable<{ data: any }> {
    return new Observable((subscriber) => {
      const abortController = new AbortController();
      const apiUrl = process.env.PICOCLAW_API_URL;
      const apiKey = process.env.PICOCLAW_API_KEY;

      if (!apiUrl || !apiKey) {
        subscriber.error(
          new Error("PICOCLAW API credentials are not configured."),
        );
        return;
      }

      const abortHandler = () => {
        this.logger.log("Client disconnected, aborting fetch to PicoClaw API.");
        abortController.abort();
      };

      signal.addEventListener("abort", abortHandler);

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ user_id: userId, prompt: prompt }),
        signal: abortController.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(
              `PicoClaw API error: ${response.status} ${response.statusText}`,
            );
          }
          if (!response.body) {
            throw new Error("No response body from PicoClaw API.");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || ""; // keep the last incomplete part in the buffer

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (trimmed.startsWith("data: ")) {
                  const dataStr = trimmed.slice(6).trim();

                  if (dataStr === "[DONE]") {
                    subscriber.next({ data: "[DONE]" });
                  } else {
                    try {
                      const parsed = JSON.parse(dataStr);
                      subscriber.next({ data: parsed });
                    } catch (e) {
                      this.logger.warn(
                        `Failed to parse JSON from chunk: ${dataStr}`,
                      );
                    }
                  }
                }
              }
            }

            if (buffer.trim()) {
              const trimmed = buffer.trim();
              if (trimmed.startsWith("data: ")) {
                const dataStr = trimmed.slice(6).trim();
                if (dataStr === "[DONE]") {
                  subscriber.next({ data: "[DONE]" });
                } else {
                  try {
                    subscriber.next({ data: JSON.parse(dataStr) });
                  } catch (e) {}
                }
              }
            }

            subscriber.complete();
          } catch (err: any) {
            if (err.name === "AbortError") {
              this.logger.log("PicoClaw stream reading aborted by client.");
              subscriber.complete();
            } else {
              this.logger.error(
                "Error reading PicoClaw stream",
                err?.stack || err,
              );
              subscriber.error(err);
            }
          } finally {
            reader.releaseLock();
            signal.removeEventListener("abort", abortHandler);
          }
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            this.logger.log("PicoClaw fetch request aborted by client.");
            subscriber.complete();
          } else {
            this.logger.error(
              "PicoClaw fetch request failed",
              err?.stack || err,
            );
            subscriber.error(err);
          }
          signal.removeEventListener("abort", abortHandler);
        });

      // Cleanup when subscriber unsubscribes early
      return () => {
        abortController.abort();
        signal.removeEventListener("abort", abortHandler);
      };
    });
  }
}
