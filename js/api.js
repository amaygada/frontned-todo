//urls
let url = "https://amaygada.pythonanywhere.com/"

let register_url = url + 'auth/register/'
let login_url = url + 'auth/token/'
let refresh_url = url + 'auth/token/refresh/'

let get_groups_url = url +'owner_groups/'
let get_tasks_url = url + 'group_tasks/'

let create_group_url = url + 'create_group/'
let create_task_url = url + 'create_task/'

let delete_group_url = url + 'delete_group/'
let delete_task_url = url + 'delete_task/'

let update_task_url = url + 'update_task/'

//async calls
export let register = async (username, email, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"username":username,"email":email,"password":password});

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    let response = await fetch(register_url, requestOptions)
    console.log(response)
    return response
}

export let signin = async (username, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"username":username ,"password":password});
    console.log(login_url)
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    let response = await fetch(login_url, requestOptions)
    console.log(response)
    return response
}

export let refresh = async (refresh_token) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"refresh":refresh_token});

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    let response = await fetch(refresh_url, requestOptions)
    console.log(response)
    return response
}

export let get_groups = async (access_token) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + access_token);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    let response = await fetch(get_groups_url, requestOptions)
    console.log(response)
    return response
}

export let create_group = async (access_token, name) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + access_token);
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"name":name});
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    let response = await fetch(create_group_url, requestOptions)
    console.log(response)
    return response
}

export let delete_group_api_call = async(access_token, id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + access_token);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    let response = fetch(delete_group_url+id, requestOptions)
    return response
}

export let get_tasks = async (access_token, id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + access_token);
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"id":id});
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    let response = fetch(get_tasks_url, requestOptions)
    return response
}

export let delete_task = (access_token, id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + access_token);
    
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    let response = fetch(delete_task_url + id, requestOptions)
    return response
}

export let create_task = async (access_token, id, data) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + access_token);
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
        "group_id": id,
        "task": {
            "data": data
        }
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    let response = await fetch(create_task_url, requestOptions)
    return response
}

export let update_task = (access_token, data, completed, id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + access_token);
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"data":data ,"completed":completed});
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    let response = fetch(update_task_url + id, requestOptions)
    return response
}