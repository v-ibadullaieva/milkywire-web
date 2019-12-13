import React from 'react';
import { create } from "react-test-renderer";

import EditForm from './EditForm';

const POST = {
  id: 0,
  type: "IMAGES",
  description: "lol",
  data: {
    media: [{
      image: "https://picsum.photos/id/0/5616/3744",
      width: 5616,
      height: 3744,
      version: "2019-03-14",
      description: "Alejandro Escamilla"
    }]
  },
  impacter_id: 0
};

describe('EditForm component', () => {
  test("Matches the snapshot", () => {
    const post = create(<EditForm post={POST} />);
    expect(post.toJSON()).toMatchSnapshot();
  });
});
