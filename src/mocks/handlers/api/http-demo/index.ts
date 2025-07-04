import { http, HttpResponse, delay } from 'msw';
import { builder } from '@/mocks/build';
import { mockUsers, mockPosts, mockComments } from './data';

// 模拟网络延迟的辅助函数
const randomDelay = (min = 100, max = 800) => {
  return delay(Math.random() * (max - min) + min);
};

// 模拟网络错误的概率
const shouldSimulateError = (errorRate = 0.1) => {
  return Math.random() < errorRate;
};

export const httpDemo = [
  // 获取用户列表
  http.get(/\/api\/http-demo\/users/, async () => {
    await randomDelay();

    // 10% 概率返回服务器错误（用于测试重试）
    if (shouldSimulateError(0.1)) {
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }

    return HttpResponse.json(builder<IMockUser[]>(mockUsers));
  }),

  // 获取单个用户
  http.get<{ id: string }>('/api/http-demo/users/:id', async ({ params }) => {
    await randomDelay();

    const userId = parseInt(params.id);
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'User not found',
      });
    }

    return HttpResponse.json(builder<IMockUser>(user));
  }),

  // 获取文章列表
  http.get(/api\/http-demo\/posts/, async ({ request }) => {
    await randomDelay();

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let posts = mockPosts;
    if (userId) {
      posts = mockPosts.filter(p => p.userId === parseInt(userId));
    }

    return HttpResponse.json(builder<IMockPost[]>(posts));
  }),

  // 获取单个文章
  http.get<{ id: string }>('/api/http-demo/posts/:id', async ({ params }) => {
    await randomDelay();

    const postId = parseInt(params.id);
    const post = mockPosts.find(p => p.id === postId);

    if (!post) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Post not found',
      });
    }

    return HttpResponse.json(builder<IMockPost>(post));
  }),

  // 创建文章
  http.post(/\/api\/http-demo\/posts/, async ({ request }) => {
    await randomDelay();

    const newPost = (await request.json()) as Partial<IMockPost>;
    const post: IMockPost = {
      id: mockPosts.length + 1,
      userId: newPost.userId || 1,
      title: newPost.title || '新文章',
      body: newPost.body || '新文章内容',
    };

    mockPosts.push(post);
    return HttpResponse.json(builder<IMockPost>(post), { status: 201 });
  }),

  // 更新文章
  http.put<{ id: string }>('/api/http-demo/posts/:id', async ({ params, request }) => {
    await randomDelay();

    const postId = parseInt(params.id);
    const updatedData = (await request.json()) as Partial<IMockPost>;
    const postIndex = mockPosts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Post not found',
      });
    }

    mockPosts[postIndex] = { ...mockPosts[postIndex], ...updatedData };
    return HttpResponse.json(builder<IMockPost>(mockPosts[postIndex]));
  }),

  // 删除文章
  http.delete<{ id: string }>('/api/http-demo/posts/:id', async ({ params }) => {
    await randomDelay();

    const postId = parseInt(params.id);
    const postIndex = mockPosts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Post not found',
      });
    }

    mockPosts.splice(postIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // 获取评论列表
  http.get(/api\/http-demo\/comments/, async ({ request }) => {
    await randomDelay();

    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');

    let comments = mockComments;
    if (postId) {
      comments = mockComments.filter(c => c.postId === parseInt(postId));
    }

    return HttpResponse.json(builder<IMockComment[]>(comments));
  }),

  // 模拟慢请求（用于测试慢请求告警）
  http.get(/api\/http-demo\/slow-endpoint/, async () => {
    await delay(5000); // 5秒延迟
    return HttpResponse.json({ message: '这是一个慢请求' });
  }),

  // 模拟总是失败的请求（用于测试重试机制）
  http.get(/api\/http-demo\/always-fail/, async () => {
    await randomDelay();
    return new HttpResponse(null, {
      status: 500,
      statusText: 'This endpoint always fails',
    });
  }),

  // 模拟间歇性失败的请求
  http.get(/api\/http-demo\/sometimes-fail/, async () => {
    await randomDelay();

    // 50% 概率失败
    if (shouldSimulateError(0.5)) {
      return new HttpResponse(null, {
        status: 503,
        statusText: 'Service temporarily unavailable',
      });
    }

    return HttpResponse.json({ message: '请求成功！' });
  }),

  // 模拟网络超时
  http.get(/api\/http-demo\/timeout/, async () => {
    await delay(800); // 8秒延迟，超过默认超时时间
    return HttpResponse.json({ message: '这个请求会超时' });
  }),

  // 404错误端点
  http.get(/api\/http-demo\/nonexistent-endpoint/, () => {
    return new HttpResponse(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }),
];
