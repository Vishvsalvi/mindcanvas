"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { deleteImage, getUserData, updateUserData } from '@/app/actions/user'
import { useSession } from 'next-auth/react'
import { CldUploadButton } from 'next-cloudinary'

interface FetchUserData {
  email: string;
  name: string;
  password: string;
  description: string;
  profileImageUrl: string;
  githubLink: string;
  linkedInLink: string;
  twitterLink: string;
  instagramLink: string;
  aboutMe: string;
}

export default function page() {

  const { data: session, status } = useSession({
    required: true,
  })

  useEffect(() => {
    if (session?.user?.email) {
      const getUserDetail = async (email: string) => {
        try {
          const user = await getUserData(email, false)
          setUserData({
            email: user?.email || '',
            name: user?.name || '',
            password: user?.password || '',
            description: user?.description || '',
            profileImageUrl: user?.profileImageUrl || '',
            githubLink: user?.githubLink || '',
            linkedInLink: user?.linkedinLink || '',
            twitterLink: user?.twitterLink || '',
            instagramLink: user?.instagramLink || '',
            aboutMe: user?.aboutMe || '',
          })
          return user
        } catch (error) {
          console.error("Error getting user data:", error)
          throw error
        }
      }

      getUserDetail(session.user.email)
    }
  }, [session])

  const handleUploadSuccess = (result: any) => {
    if (result.event === "success") {
        const newCoverImageId = result.info.public_id;
        console.log(newCoverImageId)
        setUserData((prevState: any) => {
            return {
                ...prevState,
                profileImageUrl: newCoverImageId,
            };
        });
    }
};

const handleRemoveImage = async (): Promise<void> => {
  try {
      await deleteImage(userData.profileImageUrl);
      setUserData((prevState: any) => {
          return {
              ...prevState,
              profileImageUrl: "",
          };
      });
  } catch (error) {
      console.error("Failed to delete image:", error);
  }
};
  const commonInputClassName = 'my-5 border py-4 px-6 w-full bg-slate-50 rounded-md focus:bg-white'

  const [userData, setUserData] = useState<FetchUserData>({
    email: '',
    name: '',
    password: '',
    description: '',
    profileImageUrl: '',
    githubLink: '',
    linkedInLink: '',
    twitterLink: '',
    instagramLink: '',
    aboutMe: '',
  })

  const updateHandler = async () => {
    try {
      await updateUserData(userData.email, userData.name, userData.description, userData.profileImageUrl,userData.aboutMe, userData.githubLink, userData.linkedInLink, userData.twitterLink, userData.instagramLink)
      alert('User data updated successfully')
    } catch (error) {
      console.error("Error updating user data:", error)
      throw error
    }
  }

  const dummyImageUrl = 'https://res.cloudinary.com/vishvsalvi/image/upload/v1721191090/kkajbyae6pkk1tjzdee4.png'


  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (

    <div className='py-36'>
      <div className='border rounded-lg grid grid-cols-1 md:grid-cols-2 mx-10 px-5 py-10'>
        <div className='col-span-1 mx-auto'>
          <img className="w-48 rounded-full mx-auto sm:mx-0" src={!userData.profileImageUrl ? dummyImageUrl: `https://res.cloudinary.com/vishvsalvi/image/upload/v1721191090/${userData.profileImageUrl}.png`} alt="Profile" />
          <CldUploadButton
          onUpload={handleUploadSuccess}
          uploadPreset="ai7umnnt"

          options={{ maxFiles: 1 }}
          className={`${userData.profileImageUrl ? 'hidden' : "mt-2 ml-[1.5rem] bg-neutral-900 text-white px-4 py-2 rounded-md text-sm"} `} >Add profile photo</CldUploadButton>
          <Button
          onClick={handleRemoveImage}
          className={`${userData.profileImageUrl ? 'ml-[1rem] mt-2' : 'hidden'}`} >Remove profile photo</Button>

          <div className='mt-5'>
            <br />
            <label htmlFor="">About You</label>
            <textarea
              rows={6}
              cols={40}
              onChange={(e) => {
                setUserData((prevData: any) => {
                  return {
                    ...prevData, aboutMe: e.target.value
                  }
                })
              }}

              value={userData.aboutMe === null ? '' : userData.aboutMe}
              className={commonInputClassName} placeholder="Profile bio (About you)" />

            <br />
            <label htmlFor="">Twitter profile</label>
            <input 
            value={userData.twitterLink}
            onChange={(e) => {
            setUserData(( prevData: any) => {
              return {
                ...prevData, twitterLink: e.target.value
              }
            })
          }} name="twitter" className={commonInputClassName} placeholder='https://x.com/username' type="text" />

            <br />
            <label htmlFor="">Github profile</label>
            <input 
            value={userData.githubLink}
            onChange={(e) => {
            setUserData(( prevData: any) => {
              return {
                ...prevData, githubLink: e.target.value
              }
            })
          }} className={commonInputClassName} placeholder='https://github.com/username' type="text" />

          </div>
        </div>

        <div className='col-span-1'>
          <label htmlFor="">Name</label>
          <input 
           onChange={(e) => {
            setUserData(( prevData: any) => {
              return {
                ...prevData, name: e.target.value
              }
            })
          }}
          value={userData.name} className={commonInputClassName} placeholder='Enter name' type="text" />
          <br />
          <label htmlFor="">Email</label>
          <input value={userData.email} className={commonInputClassName} placeholder='Enter email' type="text" />
          <br />
          <label htmlFor="">Profile Tagline</label>
          <input
              onChange={(e) => {
                setUserData(( prevData: any) => {
                  return {
                    ...prevData, description: e.target.value
                  }
                })
              }}
          value={userData.description} className={commonInputClassName} placeholder='Profile Tagline' type="text" />
          <br />
          <label htmlFor="">Password</label>
          <input
          onChange={(e) => {
            setUserData(( prevData: any) => {
              return {
                ...prevData, password: e.target.value
              }
            })
          }}
          value={userData.password} className={commonInputClassName} placeholder='Enter new password' type="password" />
          <br />
          <label htmlFor="">LinkedIn profile</label>
          <input 
          value={userData.linkedInLink}
          onChange={(e) => {
            setUserData(( prevData: any) => {
              return {
                ...prevData, linkedInLink: e.target.value
              }
            })
          }} className={commonInputClassName} placeholder='https://linkedin.com/username' type="text" />
          <br />
          <label htmlFor="">Instagram profile</label>
          <input
          value={userData.instagramLink}
          onChange={(e) => {
            setUserData(( prevData: any) => {
              return {
                ...prevData, instagramLink: e.target.value
              }
            })
          }}
          className={commonInputClassName} placeholder='https://instagram.com/username' type="text" />

          <Button
          onClick={updateHandler}
          >Update</Button>

        </div>
      </div>
    </div>

  )
}
