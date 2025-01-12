public static class ApiEndpoints
{
    // TODO: Maybe prefix with "api"
    private const string ApiBase = "";
    
    public static class Forklift
    {
        private const string Base = $"{ApiBase}/forklifts";

        public const string GetAll = Base;

        public const string UploadJson = $"{Base}/upload-json";

        // TODO: Restore and update to support all CRUD operations for Forklifts         
        //public const string Create = Base;
        //public const string Get = $"{Base}/{{idOrSlug}}";
        //public const string Update = $"{Base}/{{id:guid}}";
        //public const string Delete = $"{Base}/{{id:guid}}";
    }
}
