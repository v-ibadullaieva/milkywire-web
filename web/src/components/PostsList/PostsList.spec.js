import React from 'react';
import { create } from "react-test-renderer";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

import PostsList from './PostsList';

const POSTS = [
  {
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
  },
  {
    id: 1,
    type: "IMAGES",
    description: "sint excepteur irure ut amet adipisicing Lorem aliqua adipisicing amet",
    data: {
      media: [{
        image: "https://picsum.photos/id/0/5616/3744",
        width: 5616,
        height: 3744,
        version: "2019-03-14",
        description: "Paul Jarvis"
      }]
    },
    impacter_id: 0
  }
];
let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('PostsList component', () => {
  test("Matches the snapshot", () => {
    const postsList = create(<PostsList />);
    expect(postsList.toJSON()).toMatchSnapshot();
  });

  test("it shows a list of posts", async () => {
    jest.spyOn(window, "fetch").mockImplementation(() => {
      const fetchResponse = {
        json: () => Promise.resolve(POSTS)
      };
      return Promise.resolve(fetchResponse);
    });

    await act(async () => {
      render(<PostsList />, container);
    });

    expect(container.textContent).toBe("EditAlejandro EscamillalolEditPaul Jarvissint excepteur irure ut amet adipisicing Lorem aliqua adipisicing amet1");
    window.fetch.mockRestore();
  });
});
