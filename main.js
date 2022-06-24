const serverUrl = "https://da83jdqdl0gt.usemoralis.com:2053/server";

const appId = "JllyuQ1vxxN5cY6WSllUYPm9IWzeyKnh6ZvZ9sS9";

Moralis.start({ serverUrl, appId });

init = async () => {

    hideElement(userInfo);

    hideElement(createItemForm);

    await Moralis.enableWeb3();

        initUser();

}

initUser = async () => {

    if (await Moralis.User.current()){

        hideElement(userConnectButton);

        showElement(userProfileButton);

        showElement(openCreateItemButton);

    }else{

        showElement(userConnectButton);

        hideElement(userProfileButton);

        hideElement(openCreateItemButton);

        hideElement(createItemForm);

    }

}

login = async () => {

    try {

        await Moralis.authenticate();

        initUser();

    } catch (error) {

        alert(error)

    }

}

logout = async () => {

    await Moralis.User.logOut();

    hideElement(userInfo);

    initUser();

}

openUserInfo = async () => {

    user = await Moralis.User.current();

    if (user){    

        const email = user.get('email');

        if(email){

            userEmailField.value = email;

        }else{

            userEmailField.value = "";

        }

        userNameField.value = user.get('username');

        const userAvatar = user.get('avatar');

        if(userAvatar){

            userAvatarImg.src = userAvatar.url();

            showElement(userAvatarImg);

        }else{

            hideElement(userAvatarImg);

        }

        showElement(userInfo);

    }else{

        login();

    }

}

saveUserInfo = async () => {

    user.set('email', userEmailField.value);

    user.set('username', userNameField.value);

    if (userAvatarFile.files.length > 0) {

        const avatar = new Moralis.File("avatar1.jpg", userAvatarFile.files[0]);

        user.set('avatar', avatar);

    }

    await user.save();

    alert("User info saved successfully!");

    openUserInfo();

}

CreateItem = async () => {      

    if (createItemFile.files.length == [0]){

        alert("Please select a file!");

        return;

    }else if (createItemNameField.files.length == 0){

        alert("Please give the item a name!");

        return;

    }

    const nftFile = new Moralis.File("nftFile.jpg", createItemFile.files[0]);

    await nftFile.saveIPFS();

    const nftFilePath = nftFile.ipfs();

    const nftFileHash = nftFile.hash();

    const Metadata = {

        name: createItemNameField.value,

        description: createItemDescriptionField.value,

        nftFilePath: nftFilePath,

        nftFileHash: nftFileHash

    };

    const nftFileMetadataFile = new Moralis.file("Metadata.json", { base64 : btoa(JSON.stringify(Metadata))});

    await nftFileMetadataFile.saveIPFS();

    const nftFileMetadataFilePath = nftFileMetadata.ipfs();

    const nftFileMetadataFileHash = nftFileMetadata.hash();

    const Item = Moralis.Object.extend("Item");

    const item = new Item();

    item.set('name', createItemNameField.value);

    item.set('description', createItemDescriptionField.value);

    item.set('nftFilePath', nftFilePath);

    item.set('nftFileHash', nftFileHash);

    item.set('metadataFilePath', nftFileMetadataFilePath);

    item.set('metadataFileHash', nftFileMetadataFileHash);

    await item.save();

    console.log(item);

}

hideElement = (element) => element.style.display = "none";

showElement = (element) => element.style.display = "block";

//Navbar

const userConnectButton = document.getElementById("btnConnect");

userConnectButton.onclick = login;

const userProfileButton = document.getElementById("btnUserInfo");

userProfileButton.onclick = openUserInfo;

const openCreateItemButton = document.getElementById("btnOpenCreateItem");

openCreateItemButton.onclick = () => showElement(createItemForm);

//User Profile

const userInfo = document.getElementById("userInfo");

const userNameField = document.getElementById("txtUsername");

const userEmailField = document.getElementById("txtEmail");

const userAvatarImg = document.getElementById("imgAvatar");

const userAvatarFile = document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);

document.getElementById("btnLogOut").onclick = logout;

document.getElementById("btnSaveUserInfo").onclick = saveUserInfo;

//Item Creation

const createItemForm = document.getElementById("createItem");

const createItemNameField = document.getElementById("txtCreateItemName");

const createItemDescriptionField = document.getElementById("txtCreateItemDescription");

const createItemPriceField = document.getElementById("numCreateItemPrice");

const createItemStatusField = document.getElementById("selectCreateItemStatus");

const createItemFile = document.getElementById("fileCreateItemFile");

document.getElementById("btnCloseCreateItem").onclick = () => hideElement(createItemForm);

init();