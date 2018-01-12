
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import $ from 'jquery';
import axios from 'axios';


class JSZipExample {

  constructor() {
    this.zip = new JSZip();
    
    this.getImageData().then(({data: {data}}) => {
      this.imgData = data;
      
      this.createFile();
      this.createFolder();
      this.getAndCreateImages();
      this.render();
    });
    
  }

  getImageData() {
    
    const jsonURL = `./imageData.json`;

    return new Promise((resolve, reject) => {
      axios.get(jsonURL).then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });

  }

  createFile() {
    
    const fileName = `ReadMe.txt`;
    const content = `Open nodejs command prompt with administrator access.
      run 'npm install'
      then run 'npm run dev'

      ****************************

      currently I have created an array with 5 images link, you can add 1K, the code will remain the same.
      I am loading the array JSON file via axios.

    `;
    this.zip.file(fileName, content);
  }

  createFolder() {
    const folderName = `images`;
    this.imgFolder = this.zip.folder(folderName);

  }
  getAndCreateImages() {
      this.imgPromiseStack  = this.imgData.map((item, i) => {
        let extension = item.substring(item.lastIndexOf('.')+1, item.length);
      
        return new Promise((resolve, reject) => {
          axios.get(item, {
            responseType: 'arraybuffer'
          })
          .then(({data}) => {
            
            this.imgFolder.file(`image${i+1}.${extension}`, data);
            resolve();
            
          }).catch((error) => {
            console.log(error);
            resolve();
          });
                        
        }); 

    });

  }

  render() {
    const zipFileName = `images.zip`;

    Promise.all(this.imgPromiseStack).then(values => { 
      
      this.zip.generateInternalStream({type:"uint8array"})
               .on('data', function (data, metadata) {
     console.log(metadata);
})
.on('error', function (e) {
    console.log(e);
})
.on('end', function () {
   
})
.resume().accumulate(function updateCallback(metadata) {
    FileSaver.saveAs(content, zipFileName);
});
     /* this.zip.generateAsync({type:"blob"})
          .then((content) => {
            alert('Done');
            $('#loading').html('Done..');
            FileSaver.saveAs(content, zipFileName);
          });
          */
    });
    
        
  }

}

new JSZipExample();

export default JSZipExample;
