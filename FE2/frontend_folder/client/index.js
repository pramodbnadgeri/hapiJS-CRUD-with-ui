async function handleFind() {
  let phone = document.getElementById("phoneSearch").value;
  console.log(phone);

  if (!phone) {
    document.querySelector(".myalert").style.display = "block";
    document.getElementById("myalert").innerText = "something is missing";
    setTimeout(() => {
      document.querySelector(".myalert").style.display = "none";
    }, 1000);
  } else {
    // fetch data
    let data = await fetch(`https://hapijs-ui.herokuapp.com/users/${phone}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Credentials": "*",
      },
    });

    // let data = await fetch('https://jsonplaceholder.typicode.com/posts');
    data = await data.json();

    let insertedstr = "";
    data.map((x, idx) => {
      let str = ` <tr>
      <th scope="row">${idx + 1}</th>
      <td>${x.name}</td>
      <td>${x.phone}</td>
      <td>${x.address}</td>
      </tr>`;

      //   let str = ` <tr>
      //     <th scope="row">${idx + 1}</th>
      //     <td>${x.id}</td>
      //     <td>${x.title}</td>
      //     <td>${x.userId}</td>
      //     </tr>`;

      insertedstr += str;
      // console.log(x)
    });

    document.getElementById("findInsert").innerHTML = insertedstr;
  }
}

async function handleGet() {
  // fetch data
  let data = await fetch("https://hapijs-ui.herokuapp.com/users", {
    // headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    //   "Access-Control-Allow-Credentials": true,
    // },
  });

  // let data = await fetch('https://jsonplaceholder.typicode.com/posts');
  data = await data.json();

  let insertedstr = "";
  data.map((x, idx) => {
    let str = ` <tr>
        <th scope="row">${idx + 1}</th>
        <td>${x.name}</td>
        <td>${x.phone}</td>
        <td>${x.address}</td>
        </tr>`;

    // let str = ` <tr>
    // <th scope="row">${idx + 1}</th>
    // <td>${x.id}</td>
    // <td>${x.title}</td>
    // <td>${x.userId}</td>
    // </tr>`

    insertedstr += str;
    // console.log(x);
  });

  document.getElementById("getInsert").innerHTML = insertedstr;
}

async function handlePost() {
  var name = document.getElementById("postname").value;
  var phone = document.getElementById("postphone").value;
  var address = document.getElementById("postaddress").value;

  if (!name || !phone || !address) {
    document.querySelector(".myalert").style.display = "block";
    document.getElementById("myalert").innerText = "something is missing";

    setTimeout(() => {
      document.querySelector(".myalert").style.display = "none";
    }, 1000);
  } else {
    // fetch data  post
    let data = await fetch("https://hapijs-ui.herokuapp.com/log", {
      method: "POST",

      body: JSON.stringify({
        name: name,
        phone: phone,
        address: address,
      }),

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Credentials": true,
      },
    });

    data = await data.json();

    console.log(name, phone, address);

    document.getElementById("postname").value = "";
    document.getElementById("postphone").value = "";
    document.getElementById("postaddress").value = "";

    setTimeout(() => {
      handleGet();
    }, 1000);
  }
}

async function handlePut() {
  let searchname = document.getElementById("putSearch").value;

  var name = document.getElementById("putname").value;
  var phone = document.getElementById("putphone").value;
  var address = document.getElementById("putaddress").value;

  // console.log(searchname, name, phone, address);

  if (!name || !phone || !address || !searchname) {
    document.querySelector(".myalert").style.display = "block";
    document.getElementById("myalert").innerText = "something is missing";
    setTimeout(() => {
      document.querySelector(".myalert").style.display = "none";
    }, 1000);
  } else {
    let data = await fetch(
      `https://hapijs-ui.herokuapp.com/update/${searchname}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ name, phone, address }),
      }
    );

    data = await data.json();

    document.getElementById("putname").value = "";
    document.getElementById("putphone").value = "";
    document.getElementById("putaddress").value = "";
    document.getElementById("putSearch").value = "";

    setTimeout(() => {
      handleGet();
    }, 1000);
  }
}

async function handleDelete() {
  let searchname = document.getElementById("delSearch").value;

  console.log(searchname);
  if (!searchname) {
    document.querySelector(".myalert").style.display = "block";
    document.getElementById("myalert").innerText = "something is missing";
    setTimeout(() => {
      document.querySelector(".myalert").style.display = "none";
    }, 1000);
  } else {
    let data = await fetch(
      `https://hapijs-ui.herokuapp.com/del/${searchname}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ searchname }),
      }
    );

    data = await data.json();

    document.getElementById("delSearch").value = "";

    setTimeout(() => {
      handleGet();
    }, 1000);
  }
}
