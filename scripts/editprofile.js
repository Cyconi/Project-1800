document.querySelector('#profileForm').addEventListener('submit', function (event){
    event.preventDefault()
    const user = firebase.auth().currentUser
    const username = document.querySelector('#username').value
    const postalcode = document.querySelector('#postalcode').value
    const profilePhoto = document.querySelector('#profilePhoto').files[0]

    if(user && profilePhoto) {

        const storageRef = firebase.storage().ref('profile_photos/' + user.uid + '/' + profilePhoto.name)

        storageRef.put(profilePhoto).then(snapshot => {
            return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {

            return db.collection('users').doc(user.uid).update({
                name: username,
                postalcode: postalcode,
                photoURL: downloadURL
            }).then(() => {
                console.log("Profile updated successfully")
                window.location.href ="main.html"

            })
        })


    }
})

function showCurrentInfo() {

    let user = firebase.auth().currentUser
   console.log("abcdefg")

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data()
                    console.log("userData")
                    const userName = userData.name
                    const postalCode = userData.postalcode

                    document.querySelector('#username').placeholder = userName
                    document.querySelector('#postalcode').placeholder = postalCode
                    if (userData.photoURL) {
                        console.log("userData.photoURL")
                        document.querySelector('#imagePreview').src = userData.photoURL
                    }
                } else {
                    console.log("No such document")
                }
            }).catch((error) => {
                console.log("Error getting document", error)
            })
        } else {
            console.log("No user log in")
        }
    })

}

showCurrentInfo()

document.querySelector('#profilePhoto').addEventListener('change', function (event){
    const [file] = event.target.files;
    const imagePreview = document.querySelector('#imagePreview')
    if (file) {
        imagePreview.src = URL.createObjectURL(file)
    }
})