interface IMockTest {
  message: string;
  now: number;
}
interface IMockRequestOptions {
  body: any;
  type: string;
  url: string;
}

/**
 * Mock数据定义
 */
interface IMockUser {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

interface IMockPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface IMockComment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}
