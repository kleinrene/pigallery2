export const Experiments = {
  loadPhotoMetadata: {
    name: 'loadPhotoMetadata',
    groups: {
      exifr: 'exifr', exifrAll: 'exifrAll', exifrSelected: 'exifrSelected', exifreader: 'exifreader', exiftool: 'exiftool'
    }
  }
};

export const ActiveExperiments: { [key: string]: string } = {};
