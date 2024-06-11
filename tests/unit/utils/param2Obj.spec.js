import { param2Obj } from '@/utils/index.js'
describe('Utils:param2Obj', () => {
  const url = 'https://thumbs.gfycat.com/AcceptableJoyfulInganue-size_restricted.gif?imageView2/1/w/80/h/80'

  it('param2Obj test', () => {
    expect(param2Obj(url)).toEqual({
      name: 'bill',
      age: '29',
      sex: '1',
      field: window.btoa('test'),
      key: '测试'
    })
  })
})
