namespace API.Errors
{
    public class ApiException
    {
        //Automatically generated based on the three properties using Constructor...
        //Notice the initial values of null
        public ApiException(int statusCode, string message = null, string details = null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }

        public int StatusCode { get; set; }

        public string Message { get; set; }

        public string Details { get; set; }
    }
}