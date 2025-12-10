# Gemini API Key Setup

## Getting Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) or [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Navigate to "Get API Key" or create a new API key
4. Copy your API key (it will look like: `AIzaSy...`)

## Setting the API Key

### Option 1: Environment Variable (Recommended)

**On macOS/Linux:**
```bash
export GEMINI_API_KEY=your_api_key_here
```

**On Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**On Windows (CMD):**
```cmd
set GEMINI_API_KEY=your_api_key_here
```

### Option 2: Create a .env File

Create a `.env` file in the `ai-service/` directory:

```bash
cd ai-service
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

Then install python-dotenv (already in requirements.txt) and the service will automatically load it.

### Option 3: Pass When Starting the Service

```bash
GEMINI_API_KEY=your_api_key_here uvicorn main:app --reload --port 8001
```

## Verifying Your API Key

After setting the key, verify it's loaded:

```bash
# Check if the environment variable is set
echo $GEMINI_API_KEY  # macOS/Linux
echo %GEMINI_API_KEY%  # Windows CMD
$env:GEMINI_API_KEY   # Windows PowerShell
```

## Troubleshooting

### "API key not valid" Error

1. **Check the key is set**: Make sure `GEMINI_API_KEY` is exported in the same terminal where you're running the service
2. **Verify the key**: Copy the key again from Google AI Studio - make sure there are no extra spaces
3. **Check API restrictions**: If you set restrictions on the key in Google Cloud Console, make sure the API is enabled
4. **Restart the service**: After setting the key, restart the uvicorn server

### "GEMINI_API_KEY environment variable is required" Error

This means the environment variable is not set. Use one of the methods above to set it.

### Testing the API Key

You can test your API key directly:

```python
import os
import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("API key not set!")
else:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Say hello!")
    print(response.text)
```

## Security Note

⚠️ **Never commit your API key to version control!**

- The `.env` file is already in `.gitignore`
- Don't hardcode the key in your code
- Use environment variables or secure secret management in production

