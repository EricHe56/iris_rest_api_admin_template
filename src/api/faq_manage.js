import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/faq/page',
    method: 'post',
    data
  })
}

export function insert(data) {
  return request({
    url: '/faq/insert',
    method: 'post',
    data
  })
}

export function replace(data) {
  return request({
    url: '/faq/replace',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/faq/delete',
    method: 'post',
    data
  })
}
