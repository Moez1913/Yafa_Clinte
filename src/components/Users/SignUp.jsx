import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import bg from '../../assets/signUpBG.jpg';
import { AuthContext } from '../../providers/AuthProvider';
import { sendEmailVerification, updateProfile } from "firebase/auth";

const SignUp = () => {
  const { creatUser, user } = useContext(AuthContext); // user from AuthContext
  const navigate = useNavigate();

  // 🔹 Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/'); // redirect to home
    }
  }, [user, navigate]);

  const handleSignUp = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const phone=form.phone.value
    const email = form.email.value;
    const password = form.password.value;
    const confirm = form.confirm.value;

    if(password !== confirm){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }

    creatUser(email, password)
      .then(result => {
        const createdUser = result.user;

        // set displayName
        updateProfile(createdUser, { displayName: name,phone:phone })
        .then(() => console.log('Name set successfully'))
        .catch(err => console.log(err));
         sendEmailVerification(createdUser)
      .then(() => {
        Swal.fire({
          icon: "info",
          title: "Verify your email",
          text: `A verification email has been sent to ${createdUser.email}. Please check your inbox!`,
          showConfirmButton: true,
        });
      })
      .catch(err => console.log("Email verification error:", err));

        // save to backend
        const userForDB = { name,phone:phone ,email: createdUser.email, uid: createdUser.uid };

        fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForDB)
        })
        .then(res => res.json())
        .then(data => {
          if (data.insertedId) {
            Swal.fire({
              icon: 'success',
              title: 'Sign Up Successful',
              text: `Welcome, ${name}!`,
              showConfirmButton: false,
              timer: 2000
            }).then(() => navigate('/')); // redirect to home
          }
        });

        form.reset();
      })
      .catch(error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Sign Up Failed',
          text: error.message
        });
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-lg w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label  className="label text-white">Full Name</label>
            <input required type="text" name='name' placeholder="Enter your full name" className="input input-bordered w-full bg-transparent text-white placeholder-white/60"  />
          </div>
          <div>
            <label className="label text-white">Phone Number</label>
            <input required type="number" name='phone' placeholder="Enter your PhoneNumber" className="input input-bordered w-full bg-transparent text-white placeholder-white/60" />
          </div>

          <div>
            <label className="label text-white">Email</label>
            <input required type="email" name='email' placeholder="Enter your email" className="input input-bordered w-full bg-transparent text-white placeholder-white/60"  />
          </div>

          <div>
            <label className="label text-white">Password</label>
            <input required type="password" name='password' placeholder="Enter your password" className="input input-bordered w-full bg-transparent text-white placeholder-white/60"  />
          </div>

          <div>
            <label className="label text-white">Confirm Password</label>
            <input required type="password" name='confirm' placeholder="Confirm your password" className="input input-bordered w-full bg-transparent text-white placeholder-white/60"  />
          </div>

          <button className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            Sign Up
          </button>
        </form>

        <p className="text-white text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;