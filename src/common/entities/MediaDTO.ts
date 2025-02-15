import {DirectoryBaseDTO, DirectoryDTO} from './DirectoryDTO';
import {PhotoDTO} from './PhotoDTO';
import {FileBaseDTO, FileDTO} from './FileDTO';
import {SupportedFormats} from '../SupportedFormats';

export interface MediaBaseDTO extends FileBaseDTO {
  name: string;
  directory: DirectoryBaseDTO;
  metadata: MediaMetadata;
  readyThumbnails: number[];
  readyIcon: boolean;
}

export interface MediaDTO extends FileDTO, MediaBaseDTO {
  id: number;
  name: string;
  directory: DirectoryDTO;
  metadata: MediaMetadata;
  readyThumbnails: number[];
  readyIcon: boolean;

}


export interface MediaMetadata {
  size: MediaDimension;
  creationDate: number;
  fileSize: number;
}


export interface MediaDimension {
  width: number;
  height: number;
}

export const MediaDTOUtils = {
  hasPositionData: (media: MediaBaseDTO): boolean => {
    return !!(media as PhotoDTO).metadata.positionData &&
      !!((media as PhotoDTO).metadata.positionData.city ||
        (media as PhotoDTO).metadata.positionData.state ||
        (media as PhotoDTO).metadata.positionData.country ||
        ((media as PhotoDTO).metadata.positionData.GPSData &&
          (media as PhotoDTO).metadata.positionData.GPSData.altitude &&
          (media as PhotoDTO).metadata.positionData.GPSData.latitude &&
          (media as PhotoDTO).metadata.positionData.GPSData.longitude));
  },
  isPhoto: (media: FileBaseDTO): boolean => {
    return !MediaDTOUtils.isVideo(media);
  },

  isVideo: (media: FileBaseDTO): boolean => {
    const lower = media.name.toLowerCase();
    for (const ext of SupportedFormats.WithDots.Videos) {
      if (lower.endsWith(ext)) {
        return true;
      }
    }
    return false;
  },

  isVideoPath: (path: string): boolean => {
    const lower = path.toLowerCase();
    for (const ext of SupportedFormats.WithDots.Videos) {
      if (lower.endsWith(ext)) {
        return true;
      }
    }
    return false;
  },

  isVideoTranscodingNeeded: (media: FileBaseDTO): boolean => {
    const lower = media.name.toLowerCase();
    for (const ext of SupportedFormats.WithDots.TranscodeNeed.Videos) {
      if (lower.endsWith(ext)) {
        return true;
      }
    }
    return false;
  },


  calcAspectRatio: (photo: MediaBaseDTO): number => {
    return photo.metadata.size.width / photo.metadata.size.height;
  }
};
