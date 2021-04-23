// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { onError } from 'apollo-link-error'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////// Request Interceptor
const RequestInterceptor = App => (config) => {
  const variables = JSON.parse(config.data).variables
  const loading = variables.loading
  if (loading && process.client) {
    App.$Toaster.addToast(loading)
  }
  return config
}

// //////////////////////////////////////////////////////// Response Interceptor
const SuccessInterceptor = (App, redirect) => (response) => {
  const graphQLRequestData = JSON.parse(response.config.data)
  const variables = graphQLRequestData.variables
  const success = variables ? variables.success : null
  const queryType = variables ? variables.queryType : null
  if (success) {
    const data = response.data.data
    if (data) {
      const responseData = data[graphQLRequestData.operationName]
      if (responseData) {
        const responseDataLen = responseData.length
        // -------------------------------- If data is returned, display a Toast
        if (responseData.id || responseDataLen > 0 || !queryType) {
          const message = success.message
          const lenI = message.length
          let compiledMessage = ''
          if (typeof message !== 'string') {
            for (let i = 0; i < lenI; i++) {
              const item = message[i]
              if (typeof item === 'string') {
                if (item === 'len') {
                  compiledMessage += responseData.length + ' '
                } else {
                  compiledMessage += item + ' '
                }
              } else if (Array.isArray(item)) {
                const lenJ = item.length
                for (let j = 0; j < lenJ; j++) {
                  const subitem = item[j]
                  compiledMessage += Array.isArray(responseData) ? responseData[0][subitem] + ' ' : responseData[subitem] + ' '
                }
              }
            }
            success.message = compiledMessage
          }
          if (process.client) {
            App.$Toaster.addToast(success)
          }
        // --------------------------- Otherwise, redirect to 404 not found page
        } else {
          if (queryType && queryType === 'page') {
            if (process.client) {
              App.$Toaster.addToast({
                type: 'toast',
                category: 'error',
                message: 'The item you are looking for does not exist',
                code: 404
              })
            }
            redirect('/admin-error', {
              code: 404,
              message: 'The item you are looking for does not exist'
            })
          }
        }
      }
    }
  }
  return response
}

// ///////////////////////////////////////////////////////////////// getHttpCode
const getHttpCode = (code, next) => {
  let httpCode = 500
  switch (code) {
    case 'UNAUTHENTICATED' : httpCode = 401; break
    case 'FORBIDDEN' : httpCode = 403; break
    case 'BAD_USER_INPUT' : httpCode = 422; break
  }
  if (next) { return next(httpCode) }
}

// ////////////////////////////////////////////////////////// compileSubmessages
const compileSubmessages = (extensions, next) => {
  const submessages = []
  Object.keys(extensions).forEach((key) => {
    if (key !== 'code' && key !== 'exception') {
      submessages.push(extensions[key])
    }
  })
  if (next) { return next(submessages) }
}

// /////////////////////////////////////////////////////////// Error Interceptor
const ErrorInterceptor = (App, redirect) => onError(({ graphQLErrors, networkError, operation, response, forward }) => {
  if (graphQLErrors) {
    console.log('==================== [GraphQL] Data Error')
    console.log(graphQLErrors)
    const queryType = operation.variables.queryType
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      getHttpCode(extensions.code, (httpCode) => {
        compileSubmessages(extensions, (submessages) => {
          if (process.client) {
            App.$Toaster.addToast({
              type: 'toast',
              category: httpCode === 422 ? 'error' : 'warning',
              message,
              submessages,
              code: httpCode
            })
          }
          if (httpCode === 401 && queryType === 'page') {
            redirect('/admin-error', {
              code: 401,
              message
            })
          }
        })
      })
    })
  }
  if (networkError) {
    console.log('==================== [GraphQL] Network Error')
    const message = 'Something went wrong. Try again later.'
    const response = networkError.response
    if (process.client) {
      App.$Toaster.addToast({
        type: 'toast',
        category: 'error',
        message,
        code: 500
      })
    }
    if (response && response.status !== 400) {
      redirect('/admin-error', {
        code: 404,
        message: 'The item you are looking for does not exist'
      })
    }
  }
})

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
export { RequestInterceptor, SuccessInterceptor, ErrorInterceptor }
