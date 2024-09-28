import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore"; // Firestore methods
import '../assets/css/User_Profile.css';

// import { Timestamp } from "firebase/firestore"; 

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
    });

    // const [statusData, setStatusData] = useState([]);
    const [coursesData, setCoursesData] = useState([]); // State for courses data

    // Fetch user data from Firestore where id = 1
    useEffect(() => {
        const fetchUser = async () => {
            const userId = 'Ha6ncx164GbU3nT7THMtCVwM8M93'; // Set the user ID to 1 (or another relevant ID)
            const userDoc = await getDoc(doc(db, "users", userId)); // Fetch the document with ID 1
            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Set user data with the combined name
                setUser({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                });
                
            } else {
                console.log("User does not exist.");
            }
        };
        fetchUser();
    }, []);


    useEffect(() => {
        const fetchCourses = async () => {
            const userID = 'Ha6ncx164GbU3nT7THMtCVwM8M93';
            const subscriptionsCol = collection(db, 'subscriptions');
            const q = query(subscriptionsCol, where("userID", "==", userID));
    
            try {
                const subscriptionSnapshot = await getDocs(q);
                const subscriptionList = subscriptionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
                if (subscriptionList.length > 0) {
                    const courseIDs = subscriptionList.map(subscription => subscription.courseID);
    
                    // Instead of fetching courses with courseIDs, you can directly fetch from the courses collection
                    const coursesCol = collection(db, 'courses');
                    const coursesPromises = courseIDs.map(courseID => getDoc(doc(coursesCol, courseID))); // Fetch each course directly by ID
                    const coursesSnapshots = await Promise.all(coursesPromises);
                    const coursesList = coursesSnapshots.map((snapshot, index) => ({
                        id: snapshot.id,
                        ...snapshot.data(),
                        endDate: subscriptionList[index].endDate // Get the endDate from subscriptions
                    }));
    
                    setCoursesData(coursesList);
                    console.log(coursesList);
                } else {
                    console.log(`No subscriptions found for userID = ${userID}.`);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);
    
    
    
    
    
    
    

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };


    // Handle form submission and update user info
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = 'Ha6ncx164GbU3nT7THMtCVwM8M93';

        // Update user data in Firestore
        const userRef = doc(db, "users", userId); // Update with the actual user ID (1)
        await updateDoc(userRef, {
            name: user.name, // Full name
            email: user.email, // Email
            phone: user.phone, // Phone number
        });

        console.log("User updated successfully");
    };

    return (
        <>
            <div className='content'>
                <div className="profile-container">
                    <div className="profile-header">
                        <h1 style={{color: '#000', textTransform: 'capitalize'}}>{user.name}</h1>
                    </div>
                    <div className="profile-content">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone:</label>
                                <input
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    value={user.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group my_perent_a_b">
                                <button type="submit">Update Profile</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="profile-container profile-container2">
                    <h2>Courses</h2>
                    <table className="status-table" style={{ color: "#000" }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Course Name</th>
                                <th>Cost</th>
                                <th>End Date</th> {/* Add column for End Date */}
                            </tr>
                        </thead>
                        <tbody>
                            {coursesData.map((course, index) => {
                                const currentDate = new Date(); // تاريخ اليوم
                                const endDate = course.endDate ? course.endDate.toDate() : null; // تحويل `endDate` إلى تاريخ
                                let daysRemaining = null;

                                // احسب الفرق بين التواريخ إذا كان `endDate` موجودًا
                                if (endDate) {
                                    const timeDiff = endDate.getTime() - currentDate.getTime(); // فرق الوقت بالملي ثانية
                                    daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); // تحويل الفارق إلى أيام
                                }

                                // تحديد اللون بناءً على عدد الأيام المتبقية
                                let textColor = "#000"; // اللون الافتراضي (أسود)
                                if (daysRemaining !== null) {
                                    if (daysRemaining < 3) {
                                        textColor = "red"; // أقل من 3 أيام: أحمر
                                    } else if (daysRemaining < 10) {
                                        textColor = "orange"; // أقل من 10 أيام: أخضر
                                    }
                                }

                                return (
                                    <tr key={course.id}>
                                        <td>{index + 1}</td>
                                        <td>{course.course_name}</td>
                                        <td>{course.total_cost}</td>
                                        <td style={{ color: textColor }}>
                                            {daysRemaining !== null ? `${daysRemaining} days` : 'No end date'}
                                        </td> {/* عرض الفرق بالأيام وتطبيق اللون */}
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>

                </div>
            </div>
        </>
    );
};

export default Profile;
