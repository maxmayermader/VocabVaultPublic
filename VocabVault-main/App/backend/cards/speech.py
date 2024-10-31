from django.core.files.base import ContentFile
from elevenlabs.client import ElevenLabs
import os
from pathlib import Path

client = ElevenLabs(
  api_key=🤫 # Defaults to ELEVEN_API_KEY
)

def getAudioPronunciation(text):
    try:
        audio_generator =client.generate(
            text=text,
            voice="Lily",
            model="eleven_multilingual_v2",
        )

        # Collect all chunks from the generator into a single bytes object
        audio_bytes = b''.join(chunk for chunk in audio_generator)
        
        # Create a ContentFile for Django model
        file_name = f"{text.replace(' ', '_')}_Pronunciation.mp3"
        content_file = ContentFile(audio_bytes, name=file_name)
        
        # Save a copy to desktop
        desktop_path = Path.home() / "Desktop"
        file_path = desktop_path / file_name
        with open(file_path, 'wb') as f:
            f.write(audio_bytes)
        
        print(f"Audio content created for: {text}")
        print(f"Audio file saved to desktop: {file_path}")
        return content_file
    except Exception as e:
        print(f"Error in getAudioPronunciation: {str(e)}")
        raise

# def getAudioPronunciation(text):
#     try:
#         audio = client.generate(
#             text=text,
#             voice="Rachel",
#             model="eleven_multilingual_v2"
#         )
#         # return File(audio, name=text+" audio.mp3")

# # Get the path to the desktop
#         desktop_path = Path.home() / "Desktop"

#         # Create a filename
#         file_name = f"{text.replace(' ', '_')}_Pronunciation.mp3"
#         file_path = desktop_path / file_name

#         # Write the audio data to the file
#         with open(file_path, 'wb') as audio_file:
#             for chunk in audio:
#                 audio_file.write(chunk)
        
#         print(f"Audio file created: {file_path}")
#         return file_path
#     except Exception as e:
#         print(f"Error in getAudioPronunciation: {str(e)}")
#         raise

# # Test the function
# file_path = getAudioPronunciation("ich bin Max!")
# print(f"File saved to: {file_path}")