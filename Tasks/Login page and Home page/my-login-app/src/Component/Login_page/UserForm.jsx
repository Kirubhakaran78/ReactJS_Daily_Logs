import React from 'react'

function UserForm({ formData, setFormData }) {
    return (
        <div>
            {/* Name */}
            <label htmlFor="name">Name: </label><br />
            <input
                type="text"
                id='name'
                value={formData.name}
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                required
            />
            <br />

            {/* Email */}
            <label htmlFor="email">Email: </label><br />
            <input type="email"
                id='email'
                value={formData.email}
                onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                }}
                required
            />
            <br />

            {/* Gender */}
            <label>Gender: </label><br />

            <label>
                <input type="radio"
                    id='gender'
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value })
                    }}
                />
                Male
            </label>

            <label>
                <input type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value })
                    }} />
                Female
            </label>


            <label htmlFor='Country'></label><br />
            <select name="Country"
                id="Country"
                onChange={(e) => {
                    setFormData({ ...formData, country: e.target.value })
                }}
                required
            >
                <option value="">--select--</option>
                <option value="australia">australia</option>
                <option value="usa">USA</option>
                <option value="canada">Canada</option>
            </select>

            <label>Skills: </label><br />
            <label>
                <input type="checkbox" value="HTML" name="skills" checked={formData.skills.includes('HTML')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setFormData(
                                {
                                    ...formData,
                                    skills: [...formData.skills,e.target.value]
                                }
                            )
                        }else{
                            setFormData(
                                {
                                    ...formData,
                                    skills:formData.skills.filter((skill)=>skill !== e.target.value)
                                }
                            )
                        }
                    }} />HTML
            </label>
            <br />

            <label>
                <input type="checkbox" value="CSS" name="skills" checked={formData.skills.includes('CSS')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setFormData(
                                {
                                    ...formData,
                                    skills: [...formData.skills,e.target.value]
                                }
                            )
                        }else{
                            setFormData(
                                {
                                    ...formData,
                                    skills:formData.skills.filter((skill)=>skill !== e.target.value)
                                }
                            )
                        }
                    }} />CSS
            </label>
            <br />

            <label>
                <input type="checkbox" value="Javascript" name="skills" checked={formData.skills.includes('Javascript')}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setFormData(
                                {
                                    ...formData,
                                    skills: [...formData.skills,e.target.value]
                                }
                            )
                        }else{
                            setFormData(
                                {
                                    ...formData,
                                    skills:formData.skills.filter((skill)=>skill !== e.target.value)
                                }
                            )
                        }
                    }} />Javascript
            </label>
            <br />

            <label>
                <input type="checkbox" name="agree" checked={formData.agree} 
                onChange={(e)=>setFormData({
                    ...formData,
                    agree:e.target.checked
                })}/>
                I agree to the terms and conditions
            </label>

            <hr />
            <h3>Live Data Preview:</h3>
            <pre>{JSON.stringify(formData,null,2)}</pre>

        </div>
    )
}

export default UserForm
