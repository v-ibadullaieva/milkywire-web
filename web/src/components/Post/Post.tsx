import React from 'react';
import { Card } from 'antd';

import './Post.scss';
import { PostType } from '../PostsList/PostsList';

interface PostProps extends React.Props<any> {
  post: PostType,
  handlePrev: () => void,
  handleNext: () => void
}

const Post = ({ post, handlePrev, handleNext }: PostProps) => {
  const { image, version, width, height } = post.data.media[0];

  return (
    <div>
      <div className='LinksWrap'>
        <span className='Link' onClick={handlePrev}>go to prev</span>
        <span className='Link' onClick={handleNext}>go to next</span>
      </div>
      <Card
        cover={<img alt='img' src={image} />}
      >
        <p>{post.description}</p>
        <p><b>version:</b> {version}</p>
        <p><b>size:</b> {width} x {height}</p>
      </Card>
    </div>
  )
}

export default Post;
