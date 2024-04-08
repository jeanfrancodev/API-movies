import path from 'path'
import fs from 'fs'
import {v4 as uuidv4} from 'uuid'

class fileService {
  save(file:any): string{
    // if(!file){
    //   return'no-image.jpg'
    // }
    const fileExtension = file.mimetype.split('/')[1] //jpg.

    const fileName = uuidv4() + "." + fileExtension

    const filePath = path.resolve('static', fileName)

    file.mv(filePath) //guarda o ficheiro no caminho especificado
    return fileName; 
  }
  delete(fileName: string) {
    const filePath = path.resolve('static', fileName)
    fs.unlinkSync(filePath)
  }
}

export default new fileService()