// Constants and Configuration
var CHANNEL_TOKEN = "XXXXX";
var GDRIVE_FOLDER_ID = "XXXXX";
var GDRIVE_FOLDER_IMAGE_ID = "XXXXX";
var GDRIVE_FOLDER_VIDEO_ID = "XXXXX";
var GDRIVE_FOLDER_AUDIO_ID = "XXXXX";

function replyMsg(replyToken, messages) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var options = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages
    })
  };
  UrlFetchApp.fetch(url, options);
}

function toDrive(messageId, meType, mType, gdriveId) {
  var url = "https://api-data.line.me/v2/bot/message/" + messageId + "/content";
  var headers = {
    "headers": { "Authorization": "Bearer " + CHANNEL_TOKEN }
  };

  try {
    var getcontent = UrlFetchApp.fetch(url, headers);
    var blob = getcontent.getBlob();
    var fileBlob = Utilities.newBlob(blob.getBytes(), meType, messageId + mType);
    var fileId = DriveApp.getFolderById(gdriveId).createFile(fileBlob).getId();
    return 'https://drive.google.com/uc?id=' + fileId;
  } catch (error) {
    Logger.log("Error uploading to Google Drive: " + error);
    return null;
  }
}

function handleFileMessage(event) {
  var fileName = event.message.fileName;
  var fileType = fileName.split('.').pop(); // ดึงนามสกุลไฟล์
  var fileN = fileName.substring(0, fileName.lastIndexOf('.')); // ดึงชื่อไฟล์โดยไม่รวมนามสกุล
  var mimetype = getMimeType(fileType);

  if (mimetype !== "undefined") {
    var messageId = event.message.id;
    var url = "https://api-data.line.me/v2/bot/message/" + messageId + "/content";
    var headers = {
      "headers": { "Authorization": "Bearer " + CHANNEL_TOKEN }
    };

    try {
      var getcontent = UrlFetchApp.fetch(url, headers);
      var blob = getcontent.getBlob();
      var fileBlob = Utilities.newBlob(blob.getBytes(), mimetype, fileName);
      var fileId = DriveApp.getFolderById(GDRIVE_FOLDER_ID).createFile(fileBlob).getId();
      var replyMessage = [
        { 'type': 'text', 'text': '📂 ชื่อไฟล์: ' + fileName + '\n.\nลิงก์ Google Drive:\nhttps://drive.google.com/file/d/' + fileId + '/view' }
      ];
    } catch (error) {
      Logger.log("Error uploading to Google Drive: " + error);
      var replyMessage = [{ 'type': 'text', 'text': 'Error uploading the file.' }];
    }
  } else {
    var replyMessage = [{ 'type': 'text', 'text': 'ไม่รองรับไฟล์ประเภทนี้' }];
  }

  return replyMessage;
}

function getMimeType(fileType) {
  var mimeTypes = {
    "pdf": "application/pdf",
    "zip": "application/zip",
    "rar": "application/vnd.rar",
    "7z": "application/x-7z-compressed",
    "doc": "application/msword",
    "xls": "application/vnd.ms-excel",
    "ppt": "application/vnd.ms-powerpoint",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "mp4": "video/mp4",
    "mp3": "audio/mpeg",
    "png": "image/png",
    "gif": "image/gif",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    // Add more mime types as needed
  };

  return mimeTypes[fileType] || "undefined";
}


function doPost(e) {
  var value = JSON.parse(e.postData.contents);
  var event = value.events[0];
  var type = event.type;
  var replyToken = event.replyToken;

  switch (type) {
    case 'message':
      var messageType = event.message.type;

      if (messageType == 'file') {
        var replyMessage = handleFileMessage(event);
      } else if (messageType == 'image') {
        var replyMessage = [{ 'type': 'text', 'text': '🖼️ ไฟล์รูปภาพ 🖼️' + '\n.\nลิงก์ Google Drive:\n' + toDrive(event.message.id, "image/jpeg", ".jpg", GDRIVE_FOLDER_IMAGE_ID) }];
      } else if (messageType == 'video') {
        var replyMessage = [{ 'type': 'text', 'text': '🎞️ ไฟล์วิดีโอ 🎞️' +  '\n.\nลิงก์ Google Drive:\n' + toDrive(event.message.id, "video/mp4", ".mp4", GDRIVE_FOLDER_VIDEO_ID) }];
      } else if (messageType == 'audio') {
        var replyMessage = [{ 'type': 'text', 'text': '🔊 ไฟล์เสียง 🔊' +  '\n.\nลิงก์ Google Drive:\n' + toDrive(event.message.id, "audio/mpeg", ".mp3", GDRIVE_FOLDER_AUDIO_ID) }];
      }

      if (replyMessage) {
        replyMsg(replyToken, replyMessage);
      }
      break;

    // Handle other event types if needed

    default:
      break;
  }
}
