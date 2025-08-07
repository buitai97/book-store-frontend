import axios from "services/axios.customize";

//User API
export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";

  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { username, password },
    {
      headers: {
        delay: 2000,
      },
    }
  );
};

export const registerAPI = (
  fullName: string,
  password: string,
  email: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user/register";
  return axios.post<IBackendRes<IRegister>>(
    urlBackend,
    { fullName, password, email, phone },
  );
};

export const logoutAPI = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post(urlBackend);
};
export const fetchAccountAPI = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend);
};

export const getDashboardAPI = () => {
  const urlBackend = "/api/v1/database/dashboard"
  return axios.get<IBackendRes<IDashBoard>>(urlBackend)
}

export const getAllOrdersAPI = () => {
  const urlBackend = "/api/v1/order?current=1&pageSize=10"
  return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend)
}
export const getUsersAPI = (query: string) => {
  const urlBackend = `/api/v1/user?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};

export const getAllUsersAPI = () => {
  const urlBackend = `/api/v1/user`;
  return axios.get<IBackendRes<IUserTable[]>>(urlBackend);
};

export const addUserAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};

export const createUsersBulkAPI = (users: ICreateUser[]) => {
  const urlBackend = "/api/v1/user/bulk-create";
  return axios.post<IBackendRes<IResponseImport>>(urlBackend, users, {
    headers: {
      delay: 1000,
    },
  });
};

export const updateUserWithNoAvatarAPI = (_id: string, fullName: string, phone: string) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    phone,
    _id
  });
};


export const updateUserAPI = (_id: string, avatar: string, fullName: string, phone: string) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    phone,
    avatar,
    _id
  });
};

export const updateUserPasswordAPI = (email: string, oldpass: string, newpass: string) => {
  const urlBackend = "/api/v1/user/change-password"
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    email, oldpass, newpass
  })
}


export const deleteUserAPI = (id: string) => {
  const urlBackend = `/api/v1/user/${id}`;

  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

// Book API
export const getBooksAPI = (params: string) => {
  const urlBackend = `/api/v1/book?${params}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend, {
    headers: {
      delay: 1000
    }
  });
};

export const getBookCategoriesAPI = () => {
  const urlBackend = `/api/v1/database/category`;
  return axios.get<IBackendRes<string[]>>(urlBackend);
};

export const uploadFileAPI = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);

  const urlBackend = `/api/v1/file/upload`;
  return axios<IBackendRes<{ fileUploaded: string }>>({
    method: "post",
    url: urlBackend,
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form.data",
      "upload-type": folder,
    },
  });
};

export const createBookAPI = (
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string
) => {
  const urlBackend = `/api/v1/book`;
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};

export const updateBookAPI = (
  id: string,
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string
) => {
  const urlBackend = `/api/v1/book/${id}`;
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};

export const deleteBookAPI = (id: string) => {
  const urlBackend = `/api/v1/book/${id}`;

  return axios.delete<IBackendRes<IRegister>>(urlBackend);
};

export const getBookByIDAPI = (id: string) => {
  const urlBackend = `/api/v1/book/${id}`
  return axios.get<IBackendRes<IBookTable>>(urlBackend)
}

export const createOrderAPI = (
  name: string,
  address: string,
  phone: string,
  totalPrice: number,
  type: string,
  detail: {
    bookName: string,
    quantity: number,
    _id: string
  }[]
) => {
  const urlBackend = `/api/v1/order`
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    name, address, phone, totalPrice, type, detail
  }, {
    headers: {
      delay: 2000
    }
  }
  )
}

export const getOrderHistoryAPI = () => {
  const urlBackend = `/api/v1/history`
  return axios.get(urlBackend)
}