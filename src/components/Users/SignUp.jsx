
import { useContext } from 'react';
import bg from '../../assets/signUpBG.jpg'
import { AuthContext } from '../../providers/AuthProvider';
const SignUp= () => {
  const {creatUser } = useContext(AuthContext);

  const handleSignUp = e =>{
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirm = form.confirm.value;
    const user={name,email,confirm}

    if(password !== confirm){
      alert('Your password did not match');
      return;
    }
    else if(password.length < 6){
      alert('Password must be 6 characters or longer');
      return;
    }
    

    creatUser (email,password)
    .then(result=>{
      const createdUser = result.user;
      console.log(createdUser);
      // save new user to database
      fetch('http://localhost:5000/users',{
        method: 'POST',
        headers:{
          'content-type': 'application/json'
        },
        body:JSON.stringify(user)
      })
      .then(res=>res.json())
      .then(data=>{
        if(data.insertedId){
          alert('User created successfully');
        }
      })
      form.reset();
    })
    .catch(error=>{
      console.log(error);
    })
  }

  return (
    <div className="flex justify-center items-center min-h-screen  bg-cover bg-center"  style={{ backgroundImage: `url(${bg})` }}>
      <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="label text-white">Full Name</label>
            <input
              type="text"
              name='name'
              placeholder="Enter your full name"
              className="input input-bordered w-full bg-transparent text-white placeholder-white/60"
            />
          </div>

          {/* Email */}
          <div>
            <label className="label text-white">Email</label>
            <input
              type="email"
              name='email'
              placeholder="Enter your email"
              className="input input-bordered w-full bg-transparent text-white placeholder-white/60"
            />
          </div>

          {/* Password */}
          <div>
            <label className="label text-white">Password</label>
            <input
              type="password"
              name='password'
              placeholder="Enter your password"
              className="input input-bordered w-full bg-transparent text-white placeholder-white/60"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label text-white">Confirm Password</label>
            <input
              type="password"
              name='confirm'
              placeholder="Confirm your password"
              className="input input-bordered w-full bg-transparent text-white placeholder-white/60"
            />
          </div>

          {/* Sign up Button */}
          <button
            
            className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          >
           <input type="submit" value="Submit" />
          </button>
          
        </form>

        {/* Already Have Account */}
        <p className="text-white text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-300 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
