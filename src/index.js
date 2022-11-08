import "./index.styl"

export default class Poll {
  rootClass = 'editor-js-audio-plugin';
  title = null;
  cover = null;
  audio = null;
  headers = {};
  uploadFileName = 'file';
  imageLoading = false;
  audioLoading = false;
  endpoint = '/';
  audioSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.535V3h8v2h-6v12a4 4 0 1 1-2-3.465zM10 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>';

  constructor({data, api, config}){
    this.title = data.title;
    this.audio = data.audio;
    this.cover = data.cover;
    this.api = api;
    if (config) {
      if (config.headers) {
        this.headers = config.headers;
      }
      if (config.endpoint) {
        this.endpoint = config.endpoint;
      }
      if (config.uploadFileName) {
        this.uploadFileName = config.uploadFileName;
      }
    }
  }

  render(){
    this.root = document.createElement('div');
    this.root.classList.add(this.rootClass);
    this.root.classList.add('cdx-block');
    this.redraw();
    return this.root;
  }

  async handleFileUpload(e) {
    if (e.target.files[0]) {
      let fd = new FormData();
      fd.append(this.uploadFileName, e.target.files[0])

      let data = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: fd
      }).then((res) => res.json());

      // let { data } = await axios.post(this.endpoint, fd, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   }
      // });
      return data.file
    }
  }

  redraw() {
    let coverLabelHTML = `<label class="cdx-button ${this.rootClass}__cover-file">
      <input type="file" class="${this.rootClass}__hidden" accept="image/*" />
      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3.15 13.628A7.749 7.749 0 0 0 10 17.75a7.74 7.74 0 0 0 6.305-3.242l-2.387-2.127-2.765 2.244-4.389-4.496-3.614 3.5zm-.787-2.303l4.446-4.371 4.52 4.63 2.534-2.057 3.533 2.797c.23-.734.354-1.514.354-2.324a7.75 7.75 0 1 0-15.387 1.325zM10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path></svg>
      <span>Добавить изображение</span>
    </label>`
    let coverRenderHTML = `<div class="${this.rootClass}__cover-image">
      <img alt="" src="${this.cover || ''}" />
      <button type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg></button>
    </div>`

    let audioLabelHTML = `<label class="cdx-button ${this.rootClass}__audio-file  ${this.audioLoading ? 'cdx-loader' : ''}">
      <input type="file" class="${this.rootClass}__hidden" accept="audio/*" />
      ${this.audioSvg}
      <span>${this.audio ? this.audio.split('/')[this.audio.split('/').length - 1] : 'Загрузить аудио-файл'}</span>
    </label>`

    this.root.innerHTML = `<div class="${this.rootClass}__cover ${this.imageLoading ? 'cdx-loader' : ''}">${this.cover ? coverRenderHTML : coverLabelHTML}</div>
    <div class="${this.rootClass}__audio">
      <input type="text" class="${this.rootClass}__audio-title cdx-input" placeholder="Название" />
      ${audioLabelHTML}
    </div>`;

    let coverContainer = this.root.querySelector(`.${this.rootClass}__cover`);
    if (this.cover) {
      let coverRender = coverContainer.querySelector(`.${this.rootClass}__cover-image button`);
      this.api.listeners.on(coverRender, 'click', (e) => {
        if (confirm("Вы уверены?")) {
          this.cover = null;
          this.redraw();
        }
      }, false);
    } else {
      let coverInput = coverContainer.querySelector(`.${this.rootClass}__cover-file input`);
      this.api.listeners.on(coverInput, 'input', (e) => {
        this.imageLoading = true;
        this.redraw();
        this.handleFileUpload(e).then((file) => {
          this.cover = file;
        }).catch((e) => {
          console.error(e.message);
        }).finally(() => {
          this.imageLoading = false;
          this.redraw();
        });
      }, false);
    }

    let audioContainer = this.root.querySelector(`.${this.rootClass}__audio`);

    let audioTitleInput = audioContainer.querySelector(`.${this.rootClass}__audio-title`);
    audioTitleInput.value = this.title || '';
    this.api.listeners.on(audioTitleInput, 'input', (e) => {
      this.title = e.target.value;
    }, false);

    let audioInput = audioContainer.querySelector(`.${this.rootClass}__audio-file input`);
    this.api.listeners.on(audioInput, 'input', (e) => {
      this.audioLoading = true;
      this.redraw();
      this.handleFileUpload(e).then((file) => {
        this.audio = file;
      }).catch((e) => {
        console.error(e.message);
      }).finally(() => {
        this.audioLoading = false;
        this.redraw();
      });
    }, false);
  }

  save(){
    return {
      title: this.title,
      audio: this.audio,
      cover: this.cover,
    };
  }

  static get toolbox() {
    return {
      title: 'Аудио',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.535V3h8v2h-6v12a4 4 0 1 1-2-3.465zM10 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>'
    };
  }
}