let smallDataXhr = new XMLHttpRequest(),
    bigDataXhr = new XMLHttpRequest(),
    table = document.querySelector('.table'),
    smallDataButton = document.querySelector('.small'),
    bigDataButton = document.querySelector('.big'),
    preloader = document.querySelector('.preloader'),
    tableCol = ['id', 'firstName', 'lastName', 'email', 'phone'],
    paginator = document.querySelector('.pagination ul'),
    body = table.querySelector('tbody'),
    info = document.querySelector('.info'),
    find = document.querySelector('#findbutton'),
    data,
    currentData;

smallDataButton.addEventListener('click', () => 
{
    preloader.classList.remove('hidden');  
    smallDataXhr.open('GET', 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D');
    smallDataXhr.send();
});

smallDataXhr.addEventListener('load', () => 
{
    paginator.innerHTML = '';
    data = JSON.parse(smallDataXhr.response);
    showTable(data);
    showPaginator(data);
    currentData = data;
});

bigDataButton.addEventListener('click', () => 
{    
    preloader.classList.remove('hidden');  
    bigDataXhr.open('GET', 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D');
    bigDataXhr.send();
});

bigDataXhr.addEventListener('load', () => 
{
    paginator.innerHTML = '';
    data = JSON.parse(bigDataXhr.response);
    if (data.length > 50) 
    {
        currentData = data.slice(0,50);
        showTable(data.slice(0,50));
        showPaginator(data);
    }
});

function showPaginator(data)
{
    let pages = Math.ceil(data.length / 50);
    
    for (let i = 1; i <= pages; i++)
    {
        let page = document.createElement('li');
        page.dataset.index = i;
        page.innerHTML = `<a href = #>${i}</a>`;
        paginator.appendChild(page);
    }
    paginator.parentNode.classList.remove('hidden');
}

function sortTable(prop, dir)
{
    currentData
        .sort((a,b) => 
        {
        return a[prop] > b[prop] ? dir : -dir;
        })
        .forEach((item, i) => 
        {
            item.el.style.order = i + 1;
        });
}

function showTable(data) 
{
    body.innerHTML = '';
    info.innerHTML = '';
    body.appendChild(createTable(data));
    table.classList.remove('hidden');
    preloader.classList.add('hidden');
}

function createTable(data) 
{
    return data
      .map((item, i) => 
      {
        item.el = createRow(item, i);
        return item.el;
      })
      .reduce((fragment, row) => 
      {
        fragment.appendChild(row);
        return fragment;
      }, document.createDocumentFragment());
}

function createRow(item, i)
{
    let row = document.createElement('tr');
        tableCol.forEach(col => {
            let cell = document.createElement('td');
            
            cell.textContent = item[col];
            row.appendChild(cell);
        });
        row.dataset.index = i;
    return row;
}

table.addEventListener('click', () => {
    if (event.target.tagName === 'TH')
    {
        event.stopPropagation();
        sortTable(event.target.textContent, event.target.getAttribute('data-dir'));
        event.target.dataset.dir = event.target.getAttribute('data-dir') * - 1;
        table.dataset.sortBy =  event.target.textContent;
    }
    if (event.target.tagName === 'TD')
    {
        let row = data[(event.target.parentNode).getAttribute('data-index')];            
        
        event.stopPropagation();
        info.innerHTML = 
            `Выбран пользователь <b>${row.firstName} ${row.lastName}</b><br>
             Описание:<br>
             <textarea>
             ${row.description}
             </textarea><br>
             Адрес проживания: <b>${row.address.streetAddress}</b><br>
             Город: <b>${row.address.city}</b><br>
             Провинция/штат: <b>${row.address.state}</b><br>
             Индекс: <b>${row.address.zip}</b>`;
    }
});

paginator.addEventListener('click', () =>
{
    event.preventDefault();
    if (event.target.tagName === 'A')
    {
        event.stopPropagation();
        let index = event.target.parentElement.getAttribute('data-index');
        showTable(data.slice((index - 1) * 50, index * 50));
        currentData = data.slice((index - 1) * 50, index * 50);
    }
});

function filter(element) 
{
    currentData.forEach(data =>
    {
        data.el.classList.add('hidden');
        for (let col of tableCol)
        {
            if (data[col].toString().indexOf(element) !== -1) 
            {
                data.el.classList.remove('hidden');
                break;
            }
        }
    });
}
find.addEventListener('click', () =>
{
    event.preventDefault();
    filter(document.querySelector('#find').value);
})