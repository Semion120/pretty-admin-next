export interface Project {
  _id: string
  name: string
  category: 'category1' | 'category2' | 'category3' | undefined
  description: string
  price: number
  dateUpdatePrice: string
}

let projects: Project[] = [
  {
    _id: '124rfg324324',
    name: 'Project1',
    category: 'category1',
    description: 'Description of example Project 2',
    price: 2000233,
    dateUpdatePrice: '12.07.2015',
  },
  {
    _id: '124rfg332gy24',
    name: 'Project2',
    category: 'category2',
    description: 'Description of example Project 2',
    price: 4020253,
    dateUpdatePrice: '07.01.2017',
  },
  {
    _id: '124rfg324324',
    name: 'Project3',
    category: 'category3',
    description: 'Description of example Project 2',
    price: 4320153,
    dateUpdatePrice: '05.04.2007',
  },
  {
    _id: '124rfg324324',
    name: 'Project4',
    category: 'category1',
    description: 'Description of example Project 2',
    price: 4153589,
    dateUpdatePrice: '15.09.2020',
  },
  {
    _id: '125131rf4324',
    name: 'Project5',
    category: 'category2',
    description: 'Description of example Project 2',
    price: 8113389,
    dateUpdatePrice: '20.02.2023',
  },
  {
    _id: '1nbmv311324',
    name: 'Project6',
    category: 'category3',
    description: 'Description of example Project 2',
    price: 1124289,
    dateUpdatePrice: '01.10.2022',
  },
]

export default projects
