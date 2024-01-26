import { graphql, HttpResponse } from 'msw';
import { example } from './example';
import { authority } from './api/index/authority';
import { test } from './api/index/test';
import { echarts } from './api/index/echarts';

export const handlers = [
  example,
  authority,
  test,
  echarts,
  graphql.query('ListMovies', () => {
    return HttpResponse.json({
      data: {
        movies: [
          {
            title: 'The Lord of The Rings',
          },
          {
            title: 'The Matrix',
          },
          {
            title: 'Star Wars: The Empire Strikes Back',
          },
        ],
      },
    });
  }),
];
