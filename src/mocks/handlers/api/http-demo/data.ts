// 生成Mock用户数据
export const mockUsers: IMockUser[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  username: `user${index + 1}`,
  email: `user${index + 1}@example.com`,
  phone: `138${String(index + 1).padStart(8, '0')}`,
  website: `user${index + 1}.com`,
  company: {
    name: `公司${index + 1}`,
    catchPhrase: `口号${index + 1}`,
    bs: `业务${index + 1}`,
  },
  address: {
    street: `街道${index + 1}`,
    suite: `套房${index + 1}`,
    city: `城市${index + 1}`,
    zipcode: `${10000 + index}`,
    geo: {
      lat: `${30 + index}`,
      lng: `${120 + index}`,
    },
  },
}));

// 生成Mock文章数据
export const mockPosts: IMockPost[] = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  userId: (index % 10) + 1,
  title: `文章标题${index + 1}`,
  body: `这是文章${
    index + 1
  }的内容。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
}));

// 生成Mock评论数据
export const mockComments: IMockComment[] = Array.from({ length: 500 }, (_, index) => ({
  id: index + 1,
  postId: (index % 100) + 1,
  name: `评论者${index + 1}`,
  email: `commenter${index + 1}@example.com`,
  body: `这是评论${
    index + 1
  }的内容。Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
}));
