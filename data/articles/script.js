const { writeFileSync } = require('fs')
let articles = [
  {
    _id: '124rfg324324',
    title: 'Object1',
    description: 'Description of example Object 2',
    shortName: 'Short Name',
    createDate: new Date().toISOString(),
    editDate: new Date().toISOString(),
    textBlocks: [
      {
        id: 'dy9Vhovj8L',
        type: 'paragraph',
        data: {
          text: 'Привет мир',
        },
      },
      {
        id: 'aMQnaZOtpO',
        type: 'header',
        data: {
          text: 'Привет мир!',
          level: 1,
        },
      },
      {
        id: 'dB6juia-ot',
        type: 'table',
        data: {
          withHeadings: true,
          content: [
            ['Столбец 1', 'Столбец 2'],
            ['Привет мир', 'Привет мир'],
          ],
        },
      },
      {
        id: '9TkhZs9URR',
        type: 'list',
        data: {
          style: 'ordered',
          items: ['Элемент списка&nbsp;', 'Элемент списка'],
        },
      },
      {
        id: '_vCI7cpzHk',
        type: 'checklist',
        data: {
          items: [
            {
              text: 'Параметр 1',
              checked: true,
            },
            {
              text: 'Параметр 2',
              checked: false,
            },
          ],
        },
      },
    ],
  },
]

const pathToFile = '/home/mrbabak/pretty-admin-next/data/articles/data.txt'

writeFileSync(pathToFile, JSON.stringify(articles))
