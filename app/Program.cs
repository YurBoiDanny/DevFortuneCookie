var builder = WebApplication.CreateBuilder(args);

// Emit structured logs  to stdout (Promtail/Loki-friendly)
builder.Logging.ClearProviders();
builder.Logging.AddJsonConsole();

var app = builder.Build();

// Simple health check endpoint
app.MapGet("/health", () => Results.Ok(new { ok = true }));

// Fortune endpoint - returns a dev-centric fortune message

//Get fortunes from a file: fortunes.txt where a fortune is a single line
var fortunes = new List<string>();
foreach (var line in File.ReadLines("fortunes.txt"))
{
    fortunes.Add(line.Trim());
}

// Total Number of Fortunes endpoint - returns the total number of fortunes available
app.MapGet(
    "/api/fortunes/count",
    (ILogger<Program> logger) =>
    {
        logger.LogInformation("Total fortunes count requested: {Count}", fortunes.Count);
        return Results.Ok(new { count = fortunes.Count });
    }
);

// Random Fortune endpoint - returns a random fortune message
app.MapGet(
    "/api/fortune",
    async (ILogger<Program> logger) =>
    {
        // Simulate variable server work (200-1200ms) to show cache improvement
        var delay = Random.Shared.Next(200, 1200);
        await Task.Delay(delay);

        var idx = Random.Shared.Next(fortunes.Count);
        var pick = fortunes[idx];
        logger.LogInformation($"fortune served with a delay of {delay} ms");

        // Return shape expected by your frontend
        return Results.Ok(
            new
            {
                id = idx,
                message = pick,
                ts = DateTimeOffset.UtcNow.ToString("o"),
                delayMs = delay,
            }
        );
    }
);

// Fortune Endpoint - takes an index and returns a specific fortune message with artificial random delay between 200-1200ms
app.MapGet(
    "/api/fortune/{index:int}",
    async (int index, ILogger<Program> logger) =>
    {
        // Simulate variable server work (200-1200ms) to show cache improvement
        var delay = Random.Shared.Next(200, 1200);
        await Task.Delay(delay);

        if (index < 0 || index >= fortunes.Count)
        {
            logger.LogWarning($"Invalid fortune index: {index}");
            return Results.NotFound(
                new
                {
                    error = "Fortune not found. Call /api/fortune/count to see the highest index that can be called",
                }
            );
        }

        var pick = fortunes[index];
        logger.LogInformation($"fortune {index} served with a delay of {delay} ms");

        // Return shape expected by your frontend
        return Results.Ok(
            new
            {
                message = pick,
                ts = DateTimeOffset.UtcNow.ToString("o"),
                delayMs = delay,
            }
        );
    }
);

// Flaky endpoint - randomly fails to demonstrate sidecar retries
app.MapGet(
    "/api/flaky",
    async (ILogger<Program> logger) =>
    {
        await Task.Delay(100);

        if (Random.Shared.NextDouble() < 0.5)
        {
            logger.LogWarning("Flaky endpoint failed");
            return Results.StatusCode(500);
        }

        logger.LogInformation("Flaky endpoint succeeded");
        return Results.Ok(new { ok = true, ts = DateTimeOffset.UtcNow });
    }
);

// IMPORTANT: listen on 8080 in container and locally
app.Urls.Add("http://0.0.0.0:8080");

app.Run();
