using Osborne.Robotics.Services;
using System.Text.Json;

// TODO: Move constants into separate file or maybe even config
const string CorsPolicyName = "OsborneRoboticsUI";
const string ForkliftsNotFoundMsg = "No forklifts found.";
const string ImportMsgFailedInvallidFileType = "Invalid file type. Please upload a JSON file.";
const string ImportMsgFailedMissingFile = "No file uploaded.";
const string ImportMsgFailedProcessingError = "Error processing file";
const string ImportMsgSuccess = "Forklift data uploaded and processed successfully.";

//TODO: Put local host url for UI into config along with other environment
//urls (for DEV, TEST, PROD etc). If deployed to the cloud, CORS values may
//also be required there.
const string LocalClientUrl = "http://localhost:4200";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins(LocalClientUrl)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// TODO: Maybe restore and introduce IMemoryCache cache usage to improve performance
// builder.Services.AddMemoryCache();
builder.Services.AddSingleton<IForkliftFleetService, ForkliftFleetService>();


// TODO: IForkliftRepository provides an abstraction. For now, InMemoryForkliftRepository is used by this could
// be replaced with a different implementation for SQL Server or any other data storage.
builder.Services.AddSingleton<IForkliftRepository, InMemoryForkliftRepository>();

var app = builder.Build();

app.UseCors(CorsPolicyName);

app.MapGet(ApiEndpoints.Forklift.GetAll, async (IForkliftFleetService forkliftFleetService) =>
{
    // TODO: Add guards input params
    var response = await forkliftFleetService.GetForkliftFleet();

    if (response == null || response.Count == 0)
    {
        return Results.NotFound(ForkliftsNotFoundMsg);
    }

    return Results.Ok(response);
});

app.MapPost(ApiEndpoints.Forklift.UploadJson, async (IForkliftFleetService forkliftFleetService, HttpRequest request) =>
{
    // TODO: Add guards input params
    if (!request.HasFormContentType || request.Form.Files.Count == 0)
    {
        return Results.BadRequest(ImportMsgFailedMissingFile);
    }

    var file = request.Form.Files[0];
    if (file.ContentType != "application/json")
    {
        return Results.BadRequest(ImportMsgFailedInvallidFileType);
    }

    try
    {
        return await ProcessForkliftJsonImport(forkliftFleetService, ImportMsgSuccess, file);
    }
    catch (Exception ex)
    {
        return Results.Problem($"{ImportMsgFailedProcessingError}:{ex.Message}");
    }
});


// TODO: Move into a service and maybe add support for mutliple file types
static async Task<IResult> ProcessForkliftJsonImport(IForkliftFleetService forkliftFleetService, string ImportMsgSuccess, IFormFile file)
{
    Stream stream = file.OpenReadStream();
    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

    var forklifts = await JsonSerializer.DeserializeAsync<IList<Forklift>>(stream, options);

    if (forklifts != null)
    {
        bool res = await forkliftFleetService.ReplaceForkliftFleet(forklifts);
        if (res)
        {
            forklifts = await forkliftFleetService.GetForkliftFleet();

            return Results.Ok(new
            {
                Message = ImportMsgSuccess,
                Forklifts = forklifts,
                TotalItems = forklifts?.Count ?? 0
            });
        }
    }
    return Results.Problem($"{ImportMsgFailedProcessingError}");
}

app.Run();


/* TODO: Add the following..
 * Authentication 
 * Authorization if required
 * Api Versioning
 * Health Checks for databases and other dependencies
 * OpenAPI/Swagger
 * HTTPS support
 */