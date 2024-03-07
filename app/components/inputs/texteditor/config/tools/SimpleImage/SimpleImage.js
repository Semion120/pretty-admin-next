import './simple-image.scss'

class SimpleImage {
  static get toolbox() {
    return {
      title: 'Image',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    }
  }

  constructor({ data }) {
    this.data = data
    this.wrapper = undefined
  }

  render() {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('simple-image')

    if (this.data.url) {
      const img = document.createElement('img')
      img.src = this.data.url
      img.alt = this.data.alt
      img.id = 'donePhoto'
      this.wrapper.appendChild(img)
      return this.wrapper
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.id = 'fileInput'

    this.wrapper.appendChild(input)

    input.placeholder = 'Paste an image URL...'

    input.addEventListener('change', (event) => {
      this._updatePhoto(event.target.files[0])
    })
    return this.wrapper
  }

  _updatePhoto(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const data = e.currentTarget.result
      const oldImage = this.wrapper.querySelector('#imageDisplay')
      const image = document.createElement('img')
      image.src = data
      image.id = 'imageDisplay'
      oldImage ? oldImage.replaceWith(image) : this.wrapper.appendChild(image)

      const input = this.wrapper.querySelector('#altInput')
      if (!input) {
        const altInput = document.createElement('input')
        altInput.id = 'altInput'
        altInput.placeholder = 'Описание изображения'
        this.wrapper.appendChild(altInput)
      }
    }
  }

  save(blockContent) {
    const image = blockContent.querySelector('#fileInput')
    const altInput = blockContent.querySelector('#altInput')
    const donePhoto = blockContent.querySelector('#donePhoto')

    const urlImage = donePhoto ? donePhoto.src : image.files[0]
    const altImage = donePhoto ? donePhoto.alt : altInput?.value

    return { url: urlImage, alt: altImage }
  }

  validate(savedData) {
    if (!savedData.url) {
      return false
    }
    return true
  }
}

export default SimpleImage
