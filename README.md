# # Line Messaging API with Google Drive Integration

## Introduction
This project integrates Line Messaging API with Google Drive for handling various file types such as images, videos, audios, and other files.

## Constants and Configuration

-   `CHANNEL_TOKEN`: Your Line Messaging API channel token.
-   `GDRIVE_FOLDER_ID`: Google Drive folder ID for storing general files.
-   `GDRIVE_FOLDER_IMAGE_ID`: Google Drive folder ID for storing image files.
-   `GDRIVE_FOLDER_VIDEO_ID`: Google Drive folder ID for storing video files.
-   `GDRIVE_FOLDER_AUDIO_ID`: Google Drive folder ID for storing audio files.

## Functions

### `replyMsg(replyToken, messages)`

This function sends a reply message using Line Messaging API.

### `toDrive(messageId, meType, mType, gdriveId)`

This function uploads a file to Google Drive and returns the file's Google Drive link.

### `handleFileMessage(event)`

This function handles file messages received through Line Messaging API, uploads the file to Google Drive, and sends a reply message with the file link.

### `getMimeType(fileType)`

This function retrieves the MIME type of a file based on its extension.

### `doPost(e)`

This function is the entry point for handling incoming HTTP POST requests, primarily from Line Messaging API events. It processes different types of messages (file, image, video, audio) and triggers appropriate actions.

## Usage

1.  Replace the placeholder values (`XXXXX`) in the constants with your actual tokens and IDs.
2.  Deploy the script to your preferred hosting platform.
3.  Configure Line Messaging API to send incoming messages to the deployed endpoint (`doPost` function).
4.  Use Line Messaging API to interact with the integrated Google Drive functionality, such as uploading and retrieving files.
