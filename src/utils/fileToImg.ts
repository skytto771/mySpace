// utils/fileUtils.ts

/**
 * 将Element Plus的Upload组件中的文件转换成Base64编码
 * @param file 上传的文件
 * @returns Promise<string> 文件的Base64编码
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

/**
 * 将Base64编码转换回文件对象
 * @param base64 Base64编码
 * @param fileName 文件名
 * @returns File 文件对象
 */
export function base64ToFile(base64: string, fileName: string): File {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], fileName, { type: mime })
}

/**
 * 将传进来的Base64编码转换成URL
 * @param base64 Base64编码
 * @returns string URL
 */
export function base64ToUrl(base64: string): string {
  const fileName = 'temp_file' // 可以根据需要指定文件名
  const file = base64ToFile(base64, fileName)
  return URL.createObjectURL(file)
}
