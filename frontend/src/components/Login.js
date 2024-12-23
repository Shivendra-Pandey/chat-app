import {Link } from 'react-router-dom';
import { useState } from 'react';   
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function Login(){
    const [cookies, setCookie] = useCookies([]);
    const [details , setDetails] = useState({ email: '', password: ''});
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            body: JSON.stringify(details),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        setCookie('token', data.token, { path: '/'  , maxAge : 60*60*24*30});
        console.log(data);
        localStorage.setItem('user' , JSON.stringify(data.user))
        navigate('/chats')
    }

    return(
        <section className="bg-gray-200 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                      <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                      <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" value={details.email} onChange={(e)=>{setDetails({
                        ...details,
                        email: e.target.value
                      })}}></input>
                  </div>
                  <div>
                      <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" value={details.password} onChange={(e)=>{setDetails({
                        ...details,
                        password : e.target.value
                    })}} ></input>
                  </div>
                  <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign in</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don't have an account yet? <Link to='/register' > <p  className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign up</p></Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
    )
}

export default Login;