import React, { useEffect, useState } from 'react';
import { Card, List, Modal, Icon } from 'antd';

import './PostsList.scss';
import { fetchPosts, deletePost, editPost } from '../../api/posts';
import Post from '../Post/Post';
import EditForm from '../EditForm/EditForm';
import { UpdatedPostType } from '../EditForm/EditForm';

export interface PostType extends UpdatedPostType {
  id: string
};

interface MoreProps extends React.Props<any> {
  post: PostType,
  handleDelete: (id: string) => void,
  handleOpenForm: (id: string) => void
}

const { Meta } = Card;

const PostsList = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [chosen, setChosen] = useState<string | null>(null);

  const getPosts = async () => {
    const posts = await fetchPosts();
    setPosts(posts);
  }

  useEffect(() => {
    getPosts();
  }, []);

  const handleOpen = (id: string | null) => {
    setChosen(id);
    setVisible(true);
  }
  
  const handleOpenForm = (id: string | null) => {
    setChosen(id);
    setVisibleForm(true);
  }

  const handleDeletePost = (id: string) => {
    deletePost(id).then(getPosts);
  }

  const handleEditPost = (data: PostType) => {
    editPost(data).then(getPosts);
  }

  const handleNext = () => {
    if (chosenIndex >= posts.length - 1) return;
    setChosen(posts[chosenIndex+1].id)
  }

  const handlePrev = () => {
    if (chosenIndex === 0) return;
    setChosen(posts[chosenIndex-1].id)
  }

  const chosenIndex = posts.findIndex(post => post.id === chosen);
  const chosenPost = posts[chosenIndex];

  return (
    <div>
      <List
        className='List'
        itemLayout='vertical'
        size='large'
        pagination={{
          pageSize: 15
        }}
        dataSource={posts}
        renderItem={post => (
          <List.Item>
            <Card
              key={post.id}
              style={{ width: 240 }}
              cover={
                <img alt='img' src={post.data.media[0].image} onClick={() => handleOpen(post.id)} className='cardImg' />
              }
              extra={<More post={post} handleDelete={handleDeletePost} handleOpenForm={handleOpenForm} />}
            >
              <Meta title={post.data.media[0].description} description={post.description} />
            </Card>
          </List.Item>
        )}/>
        <Modal
          title={chosen ? chosenPost.data.media[0].description : 'Post'}
          visible={visible}
          footer={null}
          onCancel={() => setVisible(false)}
        >
          <Post post={chosenPost} handleNext={handleNext} handlePrev={handlePrev} />
        </Modal>
        <Modal
          title={chosen ? chosenPost.data.media[0].description : 'Post'}
          visible={visibleForm}
          footer={null}
          onCancel={() => setVisibleForm(false)}
        >
          <EditForm post={chosenPost} onCancel={() => setVisibleForm(false)} editPost={handleEditPost} />
        </Modal>
      </div>
  )
}

const More = ({ post, handleDelete, handleOpenForm }: MoreProps) => (
  <div>
    <a onClick={() => handleOpenForm(post.id)}>Edit</a>
    <Icon type='delete' theme='twoTone' onClick={() => handleDelete(post.id)} />
  </div>
);

export default PostsList;