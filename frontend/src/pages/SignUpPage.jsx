import React from 'react'
import { useState } from 'react';
import { MessageCircleCode } from 'lucide-react';
import { Link } from 'react-router';
import image from '../assets/i.png';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';
const SignUpPage = () => {

    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const {mutate, isPending, error} = useMutation({
        mutationFn: signup,
        onSuccess:()=> queryClient.invalidateQueries({queryKey: ["authUser"]}),
    })

    const handleSignup = (e) => {
        e.preventDefault();
        mutate(signupData);
    }
    

    return (
        <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' >
            <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

                <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>

                    <div className='mb-4 flex items-center justify-start gap-2'>
                        <MessageCircleCode className="size-9 text-primary" />
                        <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                            BUZZROOM
                        </span>

                        
                    </div>
                    {error &&(
                            <div className='alert alert-error mb-2 bg-red-700 opacity-70 text-white text-md font-bold'>{error.response.data.message}</div>
                        )}
                    <div className='w-full'>
                        <form onSubmit={handleSignup}>
                            <div className='space-y-4'>
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Create an Account
                                    </h2>
                                    <p>
                                        Don't just scroll. Buzz in. Join BuzzRoom today!
                                    </p>
                                </div>

                                <div className='space-y-4'>
                                    <div className='form-control w-full'>
                                        <label className='label-text'>
                                            Full Name
                                        </label>
                                        <input type='text'
                                            placeholder='John Doe'
                                            className='input input-bordered w-full'
                                            value={signupData.fullName}
                                            onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className='form-control w-full'>
                                        <label className='label-text'>
                                            E-Mail
                                        </label>
                                        <input type='email'
                                            placeholder='Johndoe@example.com'
                                            className='input input-bordered w-full'
                                            value={signupData.email}
                                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className='form-control w-full'>
                                        <label className='label-text'>
                                            Password
                                        </label>
                                        <input type='password'
                                            placeholder='Minimum 6 characters'
                                            className='input input-bordered w-full'
                                            value={signupData.password}
                                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            required

                                        />
                                    </div>
                                    <div className='form-control'>
                                        <label className='label cursor-pointer justify-start gap-2'>
                                            <input type='checkbox' className='checkbox checkbox-sm' required />
                                            <span className='text-xs leading-tight'>
                                                I agree to the{" "}
                                                <span className='text-primary hover:underline'>terms of service</span> and{" "}
                                                <span className='text-primary hover:underline'>privacy policy</span>
                                            </span>
                                        </label>
                                    </div>
                                    <button className='btn btn-primary w-full' type='submit'>
                                        {isPending ? (
                                            <>
                                            <span className='loading loading-spinner loading-xs'>
                                                Loading...
                                            </span>
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>

                                    <div className='text-center mt-4'>
                                        <p className='text-sm'>
                                            Already have an account?{" "}
                                            <Link to={"/login"} className='text-primary hover:underline'>
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>

                <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
                    <div className='max-w-md p-8'>
                        <div className='relative aspect-square max-w-sm mx-auto'>
                            <img src={image} alt="Signup Illustr." className='w-full h-full' />
                        </div>

                        <div className='text-center space-y-3 mt-6'>
                            <h2 className='text-xl font-semibold'>Connect with other users worldwide</h2>
                            <p className='opacity-70'>
                                Vibe.Connect.Enjoy.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SignUpPage