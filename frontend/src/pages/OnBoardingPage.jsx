import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeOnboarding } from '../lib/api';
import { CameraIcon, LoaderIcon, LocateFixedIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();


  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });  

  const{mutate:onboardingMutation, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess:() => {
      toast.success("Profile Onboarded Successfully");
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; 
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  }

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formState.profilePic?(
                  <img
                  src={formState.profilePic}
                  alt="profile Preview"
                  className='w-full h-full object-cover'/>
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>

                )}
              </div>

              <div className='flex items-center gap-2'>
                <button type='button' onClick={handleRandomAvatar} className='btn btn-accent rounded-full '>
                  <ShuffleIcon className='size-4 mr-2'/>
                  Generate Random Avatar
                </button>
              </div>
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Full Name</span>
                </label>
                <input
                  type='text'
                  name='fullName'
                  value={formState.fullName}
                  onChange={(e) => setFormState({...formState, fullname: e.target.value})}
                  className='input input-bordered w-full'
                  placeholder='Your full name'
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Bio</span>
                </label>
                <input
                  type='description'
                  name='bio'
                  value={formState.bio}
                  onChange={(e) => setFormState({...formState, bio: e.target.value})}
                  className='textarea textarea-bordered w-full h-24 '
                  placeholder='Tell others about yourself'
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Location</span>
                </label>
                <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10 "
                  placeholder="City, Country"
                />
              </div>
              </div>
              
            
            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage