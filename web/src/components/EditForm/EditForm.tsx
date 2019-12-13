import React, { useEffect, useState, FormEvent } from 'react';
import { Form, Input, Button, Upload, Icon, message } from 'antd';
import { WrappedFormUtils, FormComponentProps } from 'antd/lib/form/Form';

import { uploadImg } from '../../api/posts';
import { PostType } from '../PostsList/PostsList';

interface EditFormProps extends FormComponentProps<any> {
  post: PostType,
  form: WrappedFormUtils,
  onCancel: () => void,
  editPost: (post: PostType) => void
}

export interface UpdatedPostType {
  description: string,
  data: {
    media: [{
      image: string,
      width: number,
      height: number,
      version: string,
      description: string
    }]
  },
}

type valuesType = {
  description: string,
  mediaDescription: string,
  height: number,
  width: number,
  version: string,
}

const hasErrors = (fieldsError: any) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const EditForm = (props: EditFormProps) => {
  const [loading] = useState(false);
  const [postThumb, setPostThumb] = useState(props.post.data.media[0].image || null);

  useEffect(() => {
    props.form.validateFields();
    return () => props.form.resetFields();
  }, [props.post.id]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.form.validateFields((err: Error, values: valuesType) => {
      if (!err) {
        const formatValues: UpdatedPostType = {
          description: values.description,
          data: {
            media: [{
              ...props.post.data.media[0],
              description: values.mediaDescription,
              height: values.height,
              width: values.width,
              version: values.version,
            }]
          }
        }

        props.editPost({ ...props.post, ...formatValues });

        props.form.resetFields();
        props.onCancel();
      }
    });
  };

  const handleImgUpload = async ({ file, onError }: any) => {
    try {
      const imgLink = await uploadImg(file);
      const data = {
        data: {
          media: [{
            ...props.post.data.media[0],
            image: imgLink.url
          }]
        }
      };

      setPostThumb(imgLink.url);
      props.editPost({ ...props.post, ...data } as PostType);

      if (!imgLink) {
        message.error('Something went wrong, contact your administrator or try again');
        return;
      }

      message.success(`${file.name} file uploaded successfully.`);
    } catch (e) {
      onError(e);
    }
  };

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className='ant-upload-text'>Upload</div>
    </div>
  );

  const { getFieldDecorator, getFieldsError, isFieldsTouched } = props.form;
  const { data: { media }, description } = props.post;

  return (
    <Form onSubmit={handleSubmit}>
      <Upload
        name='img'
        listType='picture-card'
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={file => handleImgUpload(file)}
      >
        {postThumb ? <img src={postThumb} alt='avatar' style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      <Form.Item label='Description'>
        {getFieldDecorator('description', {
          initialValue: description ? description : 'Please enter description',
          rules: [{ required: true, message: 'Please enter description' }],
        })(
          <Input.TextArea placeholder='Enter description' />
        )}
      </Form.Item>
      <Form.Item label='Media description'>
        {getFieldDecorator('mediaDescription', {
          initialValue: media[0].description ? media[0].description : 'Please enter media description',
          rules: [{ required: true, message: 'Please enter media description' }],
        })(
          <Input.TextArea placeholder='Enter media description' />
        )}
      </Form.Item>
      <Form.Item label='Media width'>
        {getFieldDecorator('width', {
          initialValue: media[0].width ? media[0].width : 'Please enter media width',
          rules: [{ required: true, message: 'Please enter media width' }],
        })(
          <Input
            type='width'
            placeholder='Enter media width'
          />
        )}
      </Form.Item>
      <Form.Item label='Media height'>
        {getFieldDecorator('height', {
          initialValue: media[0].height ? media[0].height : 'Please enter media height',
          rules: [{ required: true, message: 'Please enter media height' }],
        })(
          <Input
            type='height'
            placeholder='Enter media height'
          />
        )}
      </Form.Item>
      <Form.Item label='Media version'>
        {getFieldDecorator('version', {
          initialValue: media[0].version ? media[0].version : 'Please enter media versiont',
          rules: [{ required: true, message: 'Please enter media version' }],
        })(
          <Input
            type='version'
            placeholder='Enter media version'
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          disabled={!isFieldsTouched() || hasErrors(getFieldsError())}
        >
          Update
        </Button>
      </Form.Item>
    </Form>
  )
}

const WrappedForm = Form.create<EditFormProps>({ name: 'EditForm' })(EditForm);

export default WrappedForm;