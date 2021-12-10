import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadPic } from '@/pages/uploadPic/services';
// import type { UploadFile } from 'antd/es/upload/interface';

const UploadPic = () => {
  const [fileList, setFileList] = useState([])

  return (
    <><Upload
      className="upload-list-inline"
      action={(file) => {
        uploadPic(file).then((res) => {
          console.log(res, "res")
        }).catch((error) => {
          console.log(error, "错误消息")
        })
      }}
      listType='picture'
      // beforeUpload={(file, files) => {
      //   // console.log(file, "file")
      //   // console.log(files, "files")
      //   setFileList(files)
      //   return false
      // }}
      // fileList={fileList}
      // onChange={(value) => {
      //   console.log(value, "图片")
      //   setFileList(value.fileList)
      // }}
      progress={{
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: percent => `${parseFloat(percent.toFixed(2))}%`,
      }}

    >
      <Button icon={<UploadOutlined />}>选择图片</Button>
    </Upload><br /><br /></>
  )
}

export default UploadPic
