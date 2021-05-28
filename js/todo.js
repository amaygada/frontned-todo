import {get_groups, refresh, create_group, delete_group_api_call, get_tasks, delete_task, create_task, update_task} from './api.js'

class Todo{

    outer_container = document.getElementById("outer_container");
    add_group_btn = document.getElementById("add_group_btn");
    group_modal = document.getElementById('group_modal');
    group_modal_close = document.getElementById('group_modal_close');
    group_modal_form = document.getElementById('group_modal_form');
    group_modal_collection_text = document.getElementById('group_modal_collection_text');
    group_modal_error = document.getElementById('group_modal_error')
    main_app_container = document.getElementById('main_app_container');

    todo_modal = document.getElementById('todo_modal');
    todo_modal_close = document.getElementById('todo_modal_close');
    todo_modal_enter_text = document.getElementById('todo_modal_enter_text');
    todo_modal_input = document.getElementById('todo_modal_item_text');
    add_item_btn = document.getElementById('add_item_btn')
    list_group = document.getElementById('list_group'); //ul under which all the list lis are present
    delete_group_btn = document.getElementById('delete_group');
    logout_btn = document.getElementById('logout_btn')

    temp_collection_name = "";
    temp_item_name = "";
    current_group_name = "";

    groups = {}

    addEL = () => {
        this.add_group_btn.addEventListener('click' , this.open_group_modal);
        this.group_modal_close.addEventListener('click' , this.close_group_modal);
        this.group_modal_form.addEventListener('submit' , this.add_group);
        this.group_modal_collection_text.addEventListener('input', this.group_name_input);
        this.main_app_container.addEventListener('click' , this.open_todo_modal);

        this.todo_modal_close.addEventListener('click' , this.todo_modal_close_btn);
        this.todo_modal_input.addEventListener('input' , this.get_item_input);
        this.todo_modal_input.addEventListener('keypress' , this.add_item);
        this.add_item_btn.addEventListener('click' , this.add_item);
        this.list_group.addEventListener('click' , this.remove_items);
        this.delete_group_btn.addEventListener('click' , this.delete_group);
        this.logout_btn.addEventListener('click', this.logout_press);

        this.list_group.addEventListener('click', this.change_status)
    }

    change_status = async (e) => {
        if(e.target.className === "list-item-container"){

            try{
                let access = localStorage.getItem('access')
                let task_data = e.target.children[0].textContent
                let task_list = JSON.parse(localStorage.getItem('tasks'))
                let id = -1
                let completed = false
                let index = 0
                for(t of task_list[this.current_group_name]){
                    if(task_data === t.data){
                        id = t.id
                        if(t.completed){
                            completed = true
                        }
                        break;
                    }
                    index+=1
                }
                let response = await update_task(access, task_data, !completed, id)
                if(response.status === 200){
                    //change color
                    if(completed) e.target.parentElement.style.backgroundColor = 'white'
                    else e.target.parentElement.style.backgroundColor = 'palegreen'
                    //add to local storage
                    task_list[this.current_group_name][index].completed = !completed
                    localStorage.setItem('tasks', JSON.stringify(task_list)) 
                }
                else if(response.status === 401){
                    let res = await refresh(localStorage.getItem("refresh"))
                    if(res.status === 200){
                        let result = await res.text()
                        result = JSON.parse(result)
                        let new_access = result["access"]
                        localStorage.setItem("access", new_access)
                        this.change_status()
                    }
                    else if(res.status === 401){
                        this.logout()
                        window.location.href = "./../html/signin.html"
                    }
                }
            }catch(e){
                alert("Unable tp change task status\nCheck your connection")
            }
        }
    }


    logout_press = e => {
        this.logout()
    }

    open_group_modal = e => {
        //blur outer_container
        //display:block group_modal
        this.outer_container.style.filter = 'blur(10px)';
        this.group_modal.style.display = 'block';
    }

    close_group_modal = e => {
        //un blur outer_container
        //display: none group_modal
        this.outer_container.style.filter = 'blur(0px)';
        this.group_modal.style.display = 'none';
        this.temp_collection_name = "";
    }   

    add_group = async (e) => {
        e.preventDefault();
        if(this.temp_collection_name in this.groups){
            this.group_modal_error.textContent = "collection exists";
            this.group_modal_error.style.display = 'block';
        }else if(this.temp_collection_name.trim() === ""){
            this.group_modal_error.textContent = "enter collection name";
            this.group_modal_error.style.display = 'block';
        }else{
            this.groups[this.temp_collection_name] = [];
            //create group card
            /*
            <div class="add-container">
                <i class="fas fa-plus plus-logo" id="add_group_btn"></i>
            </div>
            */
           await this.create_group(this.temp_collection_name)
           let name = this.temp_collection_name;
            if(this.temp_collection_name.length > 10){
                name = this.temp_collection_name.substring(0,10);
                name += "..."
            }
            let div = document.createElement('div');
            div.className = "add-container group-container"
            let s = document.createElement('span');
            s.className = 'group-text'
            let t = document.createTextNode(name);
            s.appendChild(t);
            div.appendChild(s);

            this.main_app_container.insertBefore(div , this.main_app_container.firstElementChild);

            //remove blur from outer_container
            //hide group_modal
            this.outer_container.style.filter = 'blur(0px)';
            this.group_modal.style.display = 'none';
            this.temp_collection_name = "";
        }
        this.group_modal_collection_text.value="";
    }

    group_name_input = e => {
        this.group_modal_error.style.display = 'none';
        this.temp_collection_name = e.target.value;
    }

    open_todo_modal = e => {
        if(e.target.classList.contains('group-container')){
            //get group name
            //console.log(this.groups); 
            let head = e.target.firstElementChild.textContent;
            this.current_group_name = head;
            this.get_init_items(head);
            this.todo_modal_enter_text.textContent = head;
            this.outer_container.style.filter = 'blur(10px)';
            this.todo_modal.style.display = 'block';
            
        }else if(e.target.classList.contains('group-text')){
            let head = e.target.textContent;
            this.current_group_name = head;
            this.get_init_items(head);
            this.todo_modal_enter_text.textContent = head;
            this.outer_container.style.filter = 'blur(10px)';
            this.todo_modal.style.display = 'block';
        }
    }

    todo_modal_close_btn = e => {
        //console.log(this.groups);
        this.outer_container.style.filter = 'blur(0px)';
        this.todo_modal.style.display = 'none';
        this.clear_items_init();
        this.current_group_name = "";
        this.temp_item_name = "";
    }

    get_item_input = e => {
        this.temp_item_name = e.target.value;
        //console.log(this.temp_item_name);
    }

    add_item = async (e) => {
        //check if temp_item_name is not ""
        //create element :- 
        /*<li class="list-group-item todo-item">
        <div class="list-item-container">
          <span>Hello</span>
          <i class="fas fa-times remove-item"></i>
        </div>
      </li>*/
        //append element to list
        //append element to groups list
        if(e.key === 'Enter' || e.type==='click'){
            try{
                let data = this.temp_item_name
                let access = localStorage.getItem('access')
                let id = JSON.parse(localStorage.getItem('groups'))[this.current_group_name].id
                if(data !== ""){
                    let response = await create_task(access, id, data)
                    if(response.status === 200){
                        let result = await response.text()
                        result = JSON.parse(result)["data"] 
                        let tasks = JSON.parse(localStorage.getItem('tasks'))
                        tasks[this.current_group_name].push(result);  
                        let li = this.get_item_elements(this.temp_item_name);
                        this.list_group.append(li);
                        this.todo_modal_input.value = "";                    
                        localStorage.setItem('tasks', JSON.stringify(tasks))
                    }
                    else if(response.status === 401){
                        let res = await refresh(localStorage.getItem("refresh"))
                        if(res.status === 200){
                            let result = await res.text()
                            result = JSON.parse(result)
                            let new_access = result["access"]
                            localStorage.setItem("access", new_access)
                            this.add_item()
                        }
                        else if(res.status === 401){
                            this.logout()
                            window.location.href = "./../html/signin.html"
                        }
                    }
                }
            }catch(e){
                alert('Unable to create task\nCheck your connection\n')
            }
        }
    }

    remove_items = async (e) => {
        //check if class called remove_item exists in classList
        if(e.target.classList.contains('remove-item')){

            try{
                let data = e.target.parentElement.firstElementChild.textContent
                let tasks = JSON.parse(localStorage.getItem('tasks'))[this.current_group_name]
                let id = -1
                for(let t of tasks){
                    if(t.data === data){
                        id = t.id
                        break
                    }
                }
                let response = await delete_task(localStorage.getItem('access') , id)
                if(response.status === 200){
                    //remove item from html 
                    //remove from groups object
                    let items = JSON.parse(localStorage.getItem('tasks'))[this.current_group_name];
                    items = items.filter(function(value, index, arr){ 
                        return value["data"] !== e.target.parentElement.firstElementChild.textContent;
                    }); 
                    let tt = JSON.parse(localStorage.getItem('tasks'))
                    tt[this.current_group_name] = items
                    localStorage.setItem('tasks' , JSON.stringify(tt))
                    console.log(JSON.parse(localStorage.getItem('tasks')))
                    //console.log(this.groups);

                    let li = e.target.parentElement.parentElement;
                    this.list_group.removeChild(li);
                }
                else if(response.status === 401){
                    let res = await refresh(localStorage.getItem("refresh"))
                    if(res.status === 200){
                        let result = await res.text()
                        result = JSON.parse(result)
                        let new_access = result["access"]
                        localStorage.setItem("access", new_access)
                        this.remove_items()
                    }
                    else if(res.status === 401){
                        this.logout()
                        window.location.href = "./../html/signin.html"
                    }    
                }
            }catch(e){
                alert("This item was not removed\nCheck your connection\n")
            }
        }
    }

    delete_group = async (e) => {

        try{

            let response = await delete_group_api_call(localStorage.getItem('access') , JSON.parse(localStorage.getItem('groups'))[this.current_group_name]["id"])
            console.log(response)
            if(response.status === 200){
                //remove group from groups map;
                delete this.groups[this.current_group_name];

                //remove html element from main-app-container
                let all = this.main_app_container.children;
                for(let i of all){
                    if(i.classList.contains('group-container')){
                        if(i.firstElementChild.textContent === this.current_group_name){
                            this.main_app_container.removeChild(i);
                            break;
                        }
                    }
                }

                //close todo_modal
                this.outer_container.style.filter = 'blur(0px)';
                this.todo_modal.style.display = 'none';
                this.clear_items_init();
                this.current_group_name = "";
                this.temp_item_name = "";
                console.log(this.groups)
            }
            else if(response.status === 401){
                let res = await refresh(localStorage.getItem("refresh"))
                if(res.status === 200){
                    let result = await res.text()
                    result = JSON.parse(result)
                    let new_access = result["access"]
                    localStorage.setItem("access", new_access)
                    this.delete_group()
                }
                else if(res.status === 401){
                    this.logout()
                    window.location.href = "./../html/signin.html"
                }  
            }
        }catch(e){
            alert("Unable to delete group\nCheck your network")
        }
    }


    //utility functions
    clear_items_init = () => {
        let all = this.list_group.children;
        all = Array.from(all)
        console.log(all);
        for(let i of all){
            this.list_group.removeChild(i);
            //console.log('removing item');
        }
    }

    get_init_items = async (grp_name) => {
        try{
            let access_token = localStorage.getItem('access')
            let g = JSON.parse(localStorage.getItem("groups"))
            let id = g[grp_name].id
            let response = await get_tasks(access_token, id)

            if(response.status === 200){
                let result = await response.text()
                result = JSON.parse(result)
                let nobj = localStorage.getItem('tasks')
                if(typeof(a) === 'undefined'){
                    nobj = {}
                }
                nobj[grp_name] = result["data"]["tasks"]
                localStorage.setItem('tasks', JSON.stringify(nobj))
                //console.log(nobj)
                for(let i = 0 ; i<nobj[grp_name].length; i++){
                    let li = this.get_item_elements(nobj[grp_name][i].data, nobj[grp_name][i].completed);
                    list_group.append(li);
                }
            }
            else if(response.status === 401){
                let res = await refresh(localStorage.getItem("refresh"))
                if(res.status === 200){
                    let result = await res.text()
                    result = JSON.parse(result)
                    let new_access = result["access"]
                    localStorage.setItem("access", new_access)
                    this.get_init_items(grp_name)
                }
                else if(res.status === 401){
                    this.logout()
                    window.location.href = "./../html/signin.html"
                }
            }
        }catch(e){
            alert("Unable to get tasks\nNetwork error")
            //get from localStorage
            let nobj = JSON.parse(localStorage.getItem('tasks'))
            if(typeof(nobj) === 'undefined'){
                nobj = {}
            }else{
                for(let i = 0 ; i<nobj[grp_name].length; i++){
                    let li = this.get_item_elements(nobj[grp_name][i].data, nobj[grp_name][i].completed);
                    list_group.append(li);
                }
            }
        }
    }

    get_item_elements = (name, completed) => {
        let li = document.createElement('li');
        li.className = "list-group-item todo-item";
        li.id = "todo_item"
        let div = document.createElement("div");
        div.className = "list-item-container";
        let span = document.createElement('span');
        let text = document.createTextNode(name);
        span.appendChild(text);
        let i = document.createElement("i");
        i.className = "fas fa-times remove-item";

        if(completed) li.style.backgroundColor = 'palegreen'

        li.appendChild(div);
        div.append(span);
        div.append(i);

        return li;
    }

    logout = () => {
        //clear tokens
        localStorage.setItem("access","")
        localStorage.setItem("refresh","")
        window.location.href = "./../index.html"
    }

    //async calls
    get_groups = async () => {
        try{
            let resp = await get_groups(localStorage.getItem('access'))
            if(resp.status === 200){
                let result = await resp.text()
                result = JSON.parse(result)
                let nobj = {}
                for(let g of result["data"]["groups"]){
                    nobj[g.name] = g; 
                }
                localStorage.setItem("groups", JSON.stringify(nobj))
                this.build_groups()
            }
            else if(resp.status === 401){
                let res = await refresh(localStorage.getItem("refresh"))
                if(res.status === 200){
                    let result = await res.text()
                    result = JSON.parse(result)
                    let new_access = result["access"]
                    localStorage.setItem("access", new_access)
                    this.get_groups()
                }
                else if(res.status === 401){
                    this.logout()
                    window.location.href = "./../html/signin.html"
                }
            }
        }catch(e){
            alert("Unable to get your groups\ncheck your network connection")
            this.build_groups()
        }
        
        //console.log(JSON.parse(localStorage.getItem('groups')))
    }

    build_groups = () => {
        let groups = JSON.parse(localStorage.getItem('groups'))
        if(typeof(groups)!=='undefined'){
            for(let g in groups){        
                this.groups[g] = []
                let div = document.createElement('div');
                div.className = "add-container group-container"
                let s = document.createElement('span');
                s.className = 'group-text'
                let t = document.createTextNode(g);
                s.appendChild(t);
                div.appendChild(s);
                this.main_app_container.insertBefore(div , this.main_app_container.firstElementChild);
            }
        }
    }

    create_group = async (name) => {
        try{
            let response = await create_group(localStorage.getItem('access'), name)
            if(response.status === 200){
                //add response to local storage list
                //create ui for added group
                let result = await response.text()
                result = JSON.parse(result)
                let g = JSON.parse(localStorage.getItem('groups'))
                g[result["data"]["name"]] = result["data"]
                localStorage.setItem("groups", JSON.stringify(g))
            }
            else if(response.status === 401){
                let res = await refresh(localStorage.getItem("refresh"))
                if(res.status === 200){
                    let result = await res.text()
                    result = JSON.parse(result)
                    let new_access = result["access"]
                    localStorage.setItem("access", new_access)
                    this.create_group(name)
                }
                else if(res.status === 401){
                    this.logout()
                    window.location.href = "./../html/signin.html"
                }   
            }
        }catch(e){
            alert("Unable to create group\nCheck your network connection")
        }
    }

}


//adding the event listeners using the class object
console.log(localStorage.getItem('access'))
if(localStorage.getItem('access')===""){
    window.location.href = "./../html/signin.html"
}
let t = new Todo();
await t.get_groups()
// localStorage.clear()
t.addEL();