const fs = require('fs').promises;
const path = require('path');

class FileHandler {
  async cleanupFile(filePath) {
    try {
      await fs.unlink(filePath);
      console.log(`🗑️ Cleaned up file: ${path.basename(filePath)}`);
    } catch (error) {
      console.error(`Failed to cleanup file ${filePath}:`, error.message);
    }
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch (error) {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  }

  getFileSize(filePath) {
    return fs.stat(filePath).then(stats => stats.size);
  }

  isValidAudioFile(filename) {
    const validExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.mp4', '.mpeg'];
    const ext = path.extname(filename).toLowerCase();
    return validExtensions.includes(ext);
  }
}

module.exports = new FileHandler();
