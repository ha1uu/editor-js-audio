import "./index.styl"

export default class Poll {
  rootClass = 'editor-js-audio-plugin';

  constructor({data, api}){
    this.data = data;
    this.api = api;
  }

  render(){
    this.root = document.createElement('div');
    this.root.classList.add(this.rootClass);
    this.root.classList.add('cdx-block');

    return this.root;
  }

  save(blockContent){
    // let result = {
    //   question: blockContent.querySelector(`.${this.rootClass}__header .${this.rootClass}__input`).value,
    //   multiple: blockContent.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:first-child input`).checked || false,
    //   quiz: blockContent.querySelector(`.${this.rootClass}__header .${this.rootClass}__checkbox:last-child input`).checked || false,
    //   answers: Array.from(blockContent.querySelectorAll(`.${this.rootClass}__body .${this.rootClass}__answer`)).map((node) => ({
    //     value: node.querySelector(`.${this.rootClass}__input`).value,
    //     checked: node.querySelector(`.${this.rootClass}__checkbox input`).checked || false,
    //   }))
    // }
    // console.log(result);
    // return result;
    return {};
  }

  static get toolbox() {
    return {
      title: 'Аудио',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 13.535V3h8v2h-6v12a4 4 0 1 1-2-3.465zM10 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>'
    };
  }
}