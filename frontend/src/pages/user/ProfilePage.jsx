import axios from "axios";
import { 
  Trash2, Pencil, LogOut, Home, List, Wallet, Lock, 
  ArrowLeftRight, MapPin, User, ChevronRight, X, Phone, Mail, Menu
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, getaddresses, updateAddress, deleteAddress } from '../../Redux/Slices/AddressSlice';
import useAlert from "../../alerts/hooks/useAlert";


const ProfilePage = () => {
 
  const navigate = useNavigate();
  const dispatch=useDispatch()
const { showToast, showSnackbar, showModal } = useAlert();
  

  const [user,setuser]=useState(null)
  const [mode, setMode] = useState("view");
  const [profileMode, setprofileMode] = useState(false); 

  const [showSecurity, setShowSecurity] = useState(false);
  const [passwordmodal, setpasswordmodal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [refreshAddresses, setRefreshAddresses] = useState(0);

  const [addressData, setAddressData] = useState({
  name: "",
  phone: "",
  pincode: "",
  houseNumber: "",
  addressLine: "",
  locality: "",
  city: "",
  district: "",
  state: "",
  addressType: "Home",
  isDefault: false,
  });

  const [formData, setFormData] = useState({
  name: "",
  phoneno: ""
  });

  const {addresses=[], loading:addressloading,error:addresserror }=useSelector((state)=>state.address)

     
        useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    userprofiledata();
        dispatch(getaddresses());
  }    
      }, [dispatch ,refreshAddresses]);

     const confirmLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

      const userprofiledata=async()=>{
        const token=localStorage.getItem("token")
        if(!token) return 
        try{
        const res= await axios.get("http://localhost:3001/api/user/auth/user",{headers:{Authorization:`Bearer ${token}`}})
        setuser(res.data.data)
          console.log(res.data);
        }catch(error){
        console.log(error);
        }
      }

      const handleUpdateProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.put("http://localhost:3001/api/user/auth/update-profile",formData, { headers: { Authorization: `Bearer ${token}` } });
          setuser(res.data.user); // update UI
          setprofileMode(false);
          } catch (err) {
            showToast(err?.message || "Something went wrong", "error");
          }
          };

          const handleAddAddress = async () => {
            try {
              if (editingId) {
                await dispatch( updateAddress({   id: editingId,   data: addressData })).unwrap();
                setRefreshAddresses(prev => prev + 1);
                showToast("Address updated successfully", "success");

              } else {
                
              await dispatch(addAddress(addressData)).unwrap();
               dispatch(getaddresses());
              showToast("Address added successfully", "success");
              }
              setAddressData({
                name: "",
                phone: "",
                pincode: "",
                houseNumber: "",
                addressLine: "",
                locality: "",
                city: "",
                district: "",
                state: "",
                addressType: "Home",
                isDefault: false,
              });
              setEditingId(null);
              setMode("view");
            } catch (error) {
              showToast(error?.message || "Something went wrong", "error");
            }
          };

         const handleDeleteAddress = async (id) => {
  showModal({
    title: "Delete Address",
    message: "Are you sure you want to delete this address?",
    type: "danger",

    onConfirm: async () => {
      try {
        await dispatch(deleteAddress(id)).unwrap();
        setRefreshAddresses(prev => prev + 1);

        showToast("Address deleted", "success");
      } catch (err) {
        showToast(err?.message || "Delete failed", "error");
      }
    },
  });
};


           const changePassword = async () => {
              if (newPassword !== confirmPassword) {
                setMessage("New passwords do not match");
                return;
              }
              try {
                const token = localStorage.getItem("token");
                const res = await axios.post("http://localhost:3001/api/user/auth/changepassword",{ currentPassword: oldPassword,newPassword: newPassword, },{headers: {Authorization: `Bearer ${token}`,}, } );
                setMessage(res.data.message);
                // Reset fields
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                // Close modal after success (optional)
                setTimeout(() => {
                  setpasswordmodal(false);
                  setMessage("");
                }, 1500);
                } catch (error) {
                setMessage(error.response?.data?.message || "Something went wrong");
                }
            };

  // Modern UI Components
  const SidebarLink = ({ icon: Icon, label, onClick, active = false, sub = false }) => (
    <button
      onClick={() => {
        onClick();
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        active ? 'bg-black text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'
      } ${sub ? 'py-2 pl-12 text-sm' : ''}`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon size={sub ? 16 : 20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-black'} />}
        <span className="font-medium tracking-tight">{label}</span>
      </div>
      {!sub && <ChevronRight size={14} className={active ? 'text-white/50' : 'text-gray-300'} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased text-slate-900 pb-12">
      
      {/* MOBILE TOP NAVIGATION BAR */}
      <div className="lg:hidden sticky top-0 z-[60] bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
             <User size={20} />
           </div>
           <span className="font-bold text-sm tracking-tight">Account</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* MOBILE OVERLAY MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-lg">Menu</h3>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all"><X size={20}/></button>
              </div>
              <nav className="space-y-1 flex-1">
                <SidebarLink icon={User} label="My Profile" onClick={() => {}} active={true} />
                <SidebarLink icon={List} label="Order History" onClick={() => navigate("/userorders")} />
                <SidebarLink icon={ArrowLeftRight} label="Transactions" onClick={() => navigate("/transactions")} />
                <SidebarLink icon={Wallet} label="My Wallet" onClick={() => navigate("/wallet")} />
                <div className="pt-2">
                  <SidebarLink icon={Lock} label="Security" onClick={() => setShowSecurity(!showSecurity)} />
                  {showSecurity && (
                    <div className="mt-1">
                      <SidebarLink label="Change Password" onClick={() => setpasswordmodal(true)} sub={true} />
                    </div>
                  )}
                </div>
              </nav>
              <div className="pt-6 border-t border-gray-100">
                <button 
                  onClick={() => { setLogoutModal(true); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DESKTOP LEFT SIDEBAR (Hidden on small screens) */}
          <aside className="hidden lg:block w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border border-gray-100">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-gray-400" size={32} />
                    )}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-bold text-lg leading-tight truncate">{user?.name || "Guest User"}</h2>
                  <p className="text-sm text-gray-400">Personal Account</p>
                </div>
              </div>

              <nav className="space-y-1">
                <SidebarLink icon={User} label="My Profile" onClick={() => {}} active={true} />
                <SidebarLink icon={List} label="Order History" onClick={() => navigate("/userorders")} />
                <SidebarLink icon={ArrowLeftRight} label="Transactions" onClick={() => navigate("/transactions")} />
                <SidebarLink icon={Wallet} label="My Wallet" onClick={() => navigate("/wallet")} />
                
                <div className="pt-2">
                  <SidebarLink icon={Lock} label="Security" onClick={() => setShowSecurity(!showSecurity)} />
                  {showSecurity && (
                    <div className="mt-1 animate-in slide-in-from-top-2 duration-200">
                      <SidebarLink label="Change Password" onClick={() => setpasswordmodal(true)} sub={true} />
                    </div>
                  )}
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => setLogoutModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    <LogOut size={20} />
                    <span>Logout Account</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 space-y-6 lg:space-y-8">
            
            {/* PROFILE DETAILS CARD */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 lg:px-8 py-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
                <div>
                  <h3 className="text-lg lg:text-xl font-bold">General Information</h3>
                  <p className="text-xs lg:text-sm text-gray-400">Manage your profile details and settings</p>
                </div>
                <button 
                  onClick={() => {
                    setFormData({ name: user.name, phoneno: user.phoneno });
                    setprofileMode(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all text-sm font-medium shadow-lg shadow-gray-200"
                >
                  <Pencil size={14} />
                  Edit Profile
                </button>
              </div>
              
              <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <User size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <label className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                    <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <label className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                    <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <label className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                    <p className="font-semibold text-gray-800 truncate">+{user?.phoneno}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ADDRESS SECTION */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="px-6 lg:px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-lg lg:text-xl font-bold">Saved Addresses</h3>
                <button 
                  onClick={() => setMode("add")}
                  className="text-xs lg:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  + Add New
                </button>
              </div>

              <div className="p-6 lg:p-8">
                {mode === "add" ? (
                  /* ADDRESS FORM UI - Functional logic untouched */
                  <div className="bg-gray-50 rounded-2xl p-5 lg:p-6 border border-gray-100">
                    <h4 className="font-bold mb-4 text-gray-700 text-sm">{editingId ? "Modify Address" : "New Address Details"}</h4>
                   

    <div className="grid md:grid-cols-2 gap-2">

         <input
          placeholder="Full Name"
          value={addressData.name}
          onChange={(e) =>
            setAddressData({ ...addressData, name: e.target.value })
          }
          className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
        />

        <input
          placeholder="Phone Number"
          value={addressData.phone}
          onChange={(e) =>
            setAddressData({ ...addressData, phone: e.target.value })
          }
          className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
        />

        <input
          placeholder="Pincode"
          value={addressData.pincode}
          onChange={(e) =>
            setAddressData({ ...addressData, pincode: e.target.value })
          }
          className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
        />

        <input
          placeholder="House / Flat No."
          value={addressData.houseNumber}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              houseNumber: e.target.value,
            })
          }
          className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
        />

        <input
          placeholder="Street / Area"
          value={addressData.addressLine}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              addressLine: e.target.value,
            })
          }
          className="border rounded px-2 py-1.5 md:col-span-2 focus:outline-none focus:ring-1 focus:ring-black"
        />

        <input
          placeholder="Locality"
          value={addressData.locality}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              locality: e.target.value,
            })
          }
          className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
        />

        <input
          placeholder="City"
          value={addressData.city}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              city: e.target.value,
            })
          }
          className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
        />

        <input
          placeholder="District"
          value={addressData.district}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              district: e.target.value,
            })
          }
          className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
        />

        <input
          placeholder="State"
          value={addressData.state}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              state: e.target.value,
            })
          }
          className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
        />

      </div>

      {/* Address Type */}
      <div className="flex gap-4 mt-3 text-sm">

        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="Home"
            checked={addressData.addressType === "Home"}
            onChange={(e) =>
              setAddressData({
                ...addressData,
                addressType: e.target.value,
              })
            }
          />
          Home
        </label>

        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="Office"
            checked={addressData.addressType === "Office"}
            onChange={(e) =>
              setAddressData({
                ...addressData,
                addressType: e.target.value,
              })
            }
          />
          Office
        </label>

      </div>

      {/* Default */}
      <label className="flex items-center gap-1 mt-2 text-sm">
        <input
          type="checkbox"
          checked={addressData.isDefault}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              isDefault: e.target.checked,
            })
          }
        />
        Default address
      </label>





                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                       <button onClick={() => setMode("view")} className="w-full sm:flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl text-sm font-bold transition-all">Cancel</button>
                       <button onClick={handleAddAddress} className="w-full sm:flex-1 sm:basis-2/3 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:-translate-y-0.5 transition-all">
                         {editingId ? "Update Address" : "Save Address"} 
                      </button>
                    </div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 lg:w-20 h-16 lg:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                      <MapPin className="text-gray-300" size={28} />
                    </div>
                    <p className="text-sm lg:text-base text-gray-500 font-medium">No saved addresses yet</p>
                    <button onClick={() => setMode("add")} className="mt-4 text-blue-600 font-bold text-sm">Create first address</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.filter(Boolean).map((addr) => (
                      <div key={addr._id} className={`p-5 lg:p-6 rounded-2xl border transition-all ${addr.isDefault ? 'border-gray-900 bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-wider ${addr.isDefault ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {addr.isDefault ? 'Primary' : addr.addressType}
                          </span>
                          <div className="flex gap-1.5 lg:gap-2">
                            <button 
                              onClick={() => {
                                setAddressData({...addr});
                                setEditingId(addr._id);
                                setMode("add");
                              }}
                              className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-black transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAddress(addr._id)}
                              className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1 text-sm lg:text-base">{addr.name}</h4>
                        <p className="text-xs lg:text-sm text-gray-500 leading-relaxed mb-3">
                          {addr.houseNumber}, {addr.addressLine}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        {!addr.isDefault && (
                          <button 
                            onClick={async () => {
                              await dispatch(updateAddress({ id: addr._id, data: { ...addr, isDefault: true } })).unwrap();
                              setRefreshAddresses(prev => prev + 1);
                            }}
                            className="text-[10px] lg:text-xs font-bold text-gray-400 hover:text-black transition-colors"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* MODALS SECTION */}
      {/* Edit Profile Modal */}
      {profileMode && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setprofileMode(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 lg:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl lg:text-2xl font-bold mb-6">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Display Name</label>
                <input 
                  type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 lg:py-4 focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone Number</label>
                <input 
                  type="text" value={formData.phoneno}
                  onChange={(e) => setFormData({ ...formData, phoneno: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 lg:py-4 focus:ring-2 focus:ring-black outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setprofileMode(false)} className="flex-1 py-3.5 lg:py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold transition-all text-sm">Cancel</button>
              <button onClick={handleUpdateProfile} className="flex-1 py-3.5 lg:py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 text-sm">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordmodal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setpasswordmodal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 lg:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setpasswordmodal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-all p-1"><X size={20}/></button>
            <h3 className="text-xl lg:text-2xl font-bold mb-2">Security Update</h3>
            <p className="text-xs lg:text-sm text-gray-400 mb-8">Ensure your account stays protected</p>
            
            <div className="space-y-4">
              <input 
                type="password" placeholder="Current Password" value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 lg:py-4 focus:ring-2 focus:ring-black outline-none text-sm"
              />
              <input 
                type="password" placeholder="New Password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 lg:py-4 focus:ring-2 focus:ring-black outline-none text-sm"
              />
              <input 
                type="password" placeholder="Confirm New Password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 lg:py-4 focus:ring-2 focus:ring-black outline-none text-sm"
              />
            </div>
            
            {message && <p className={`mt-4 text-center text-[10px] lg:text-sm font-semibold py-2 rounded-lg ${message.includes('match') ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'}`}>{message}</p>}
            
            <button 
              onClick={changePassword}
              className="w-full py-3.5 lg:py-4 mt-8 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all text-sm"
            >
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {logoutModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLogoutModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 lg:p-8 shadow-2xl text-center">
            <div className="w-14 lg:w-16 h-14 lg:h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut size={28} />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold mb-2">Logout</h3>
            <p className="text-xs lg:text-sm text-gray-400 mb-8 leading-relaxed">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutModal(false)} className="flex-1 py-3 lg:py-3.5 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold transition-all text-sm">Cancel</button>
              <button onClick={confirmLogout} className="flex-1 py-3 lg:py-3.5 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all text-sm">Logout</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;






// import axios from "axios";
// import { Trash2 } from "lucide-react";
// import { Pencil, LogOut, Home, List, Wallet, Lock } from "lucide-react";
// import { useEffect, useState } from "react";
// import edit from "../../assets/edit-icon.png"
// import email from "../../assets/email-icon.png"
// import profile from "../../assets/profile-icon.png"
// import { ArrowLeftRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch ,useSelector} from 'react-redux'
// import { addAddress, getaddresses,updateAddress,deleteAddress } from '../../Redux/Slices/AddressSlice';



// const ProfilePage = () => {

//   const navigate = useNavigate();
//   const dispatch=useDispatch()

//   const [user,setuser]=useState(null)
//   const [mode, setMode] = useState("view");
//   const [profileMode, setprofileMode] = useState(false); 

//   const [showSecurity, setShowSecurity] = useState(false);
//   const [passwordmodal, setpasswordmodal] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const [editingId, setEditingId] = useState(null);
//   const [logoutModal, setLogoutModal] = useState(false);

//   const [refreshAddresses, setRefreshAddresses] = useState(0);

//   const [addressData, setAddressData] = useState({
//   name: "",
//   phone: "",
//   pincode: "",
//   houseNumber: "",
//   addressLine: "",
//   locality: "",
//   city: "",
//   district: "",
//   state: "",
//   addressType: "Home",
//   isDefault: false,
//   });

//   const [formData, setFormData] = useState({
//   name: "",
//   phoneno: ""
//   });

//   const {addresses=[], loading:addressloading,error:addresserror }=useSelector((state)=>state.address)

     
//         useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     userprofiledata();
//         dispatch(getaddresses());
//   }    
//       }, [dispatch ,refreshAddresses]);

//      const confirmLogout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   navigate("/login");
// };

//       const userprofiledata=async()=>{
//         const token=localStorage.getItem("token")
//         if(!token) return 
//         try{
//         const res= await axios.get("http://localhost:3001/api/user/auth/user",{headers:{Authorization:`Bearer ${token}`}})
//         setuser(res.data.data)
//           console.log(res.data);
//         }catch(error){
//         console.log(error);
//         }
//       }

//       const handleUpdateProfile = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           const res = await axios.put("http://localhost:3001/api/user/auth/update-profile",formData, { headers: { Authorization: `Bearer ${token}` } });
//           setuser(res.data.user); // update UI
//           setprofileMode(false);
//           } catch (err) {
//             console.error(err);
//           }
//           };

//           const handleAddAddress = async () => {
//             try {
//               if (editingId) {
//                 await dispatch( updateAddress({   id: editingId,   data: addressData })).unwrap();
//                 setRefreshAddresses(prev => prev + 1);
//                 alert("Address updated successfully");

//               } else {
                
//               await dispatch(addAddress(addressData)).unwrap();
//                dispatch(getaddresses());
//               alert("Address added successfully");
//               }
//               setAddressData({
//                 name: "",
//                 phone: "",
//                 pincode: "",
//                 houseNumber: "",
//                 addressLine: "",
//                 locality: "",
//                 city: "",
//                 district: "",
//                 state: "",
//                 addressType: "Home",
//                 isDefault: false,
//               });
//               setEditingId(null);
//               setMode("view");
//             } catch (error) {
//               alert(error);
//             }
//           };

//           const handleDeleteAddress = async (id) => {
//                 const confirmDelete = window.confirm(
//                   "Are you sure you want to delete this address?"
//                 );
//                 if (!confirmDelete) return;
//                 try {
//                   await dispatch(deleteAddress(id)).unwrap();
//                   setRefreshAddresses(prev => prev + 1);
//                   alert("Address deleted");
//                 } catch (err) {
//                   alert(err);
//                 }

//           };


//            const changePassword = async () => {
//               if (newPassword !== confirmPassword) {
//                 setMessage("New passwords do not match");
//                 return;
//               }
//               try {
//                 const token = localStorage.getItem("token");
//                 const res = await axios.post("http://localhost:3001/api/user/auth/changepassword",{ currentPassword: oldPassword,newPassword: newPassword, },{headers: {Authorization: `Bearer ${token}`,}, } );
//                 setMessage(res.data.message);
//                 // Reset fields
//                 setOldPassword("");
//                 setNewPassword("");
//                 setConfirmPassword("");
//                 // Close modal after success (optional)
//                 setTimeout(() => {
//                   setpasswordmodal(false);
//                   setMessage("");
//                 }, 1500);
//                 } catch (error) {
//                 setMessage(error.response?.data?.message || "Something went wrong");
//                 }
//             };


// const renderAddressContent = () => {

//   // ===== EMPTY STATE =====
//   if (addresses.length === 0 && mode !== "add") {
//     return (
//       <div className="text-center py-10 border border-dashed rounded-lg">
//         <Home size={36} className="mx-auto text-gray-400 mb-3" />

//         <p className="text-sm text-gray-600 mb-4">
//           No saved addresses
//         </p>

//         <button
//           onClick={() => setMode("add")}
//           className="bg-black text-white px-4 py-1.5 text-sm rounded-md hover:bg-gray-800"
//         >
//           Add Address
//         </button>
//       </div>
//     );
//   }

//   // ===== ADD ADDRESS FORM =====
// if (mode === "add") {
//   return (
//     <div className="border rounded-lg p-4 bg-gray-50 text-sm">

//       <p className="font-medium mb-3">
//       {editingId ? "Edit Address" : "Add New Address"}
//     </p>


//       <div className="grid md:grid-cols-2 gap-2">

//         <input
//           placeholder="Full Name"
//           value={addressData.name}
//           onChange={(e) =>
//             setAddressData({ ...addressData, name: e.target.value })
//           }
//           className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//         <input
//           placeholder="Phone Number"
//           value={addressData.phone}
//           onChange={(e) =>
//             setAddressData({ ...addressData, phone: e.target.value })
//           }
//           className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//         <input
//           placeholder="Pincode"
//           value={addressData.pincode}
//           onChange={(e) =>
//             setAddressData({ ...addressData, pincode: e.target.value })
//           }
//           className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//         <input
//           placeholder="House / Flat No."
//           value={addressData.houseNumber}
//           onChange={(e) =>
//             setAddressData({
//               ...addressData,
//               houseNumber: e.target.value,
//             })
//           }
//           className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//         <input
//           placeholder="Street / Area"
//           value={addressData.addressLine}
//           onChange={(e) =>
//             setAddressData({
//               ...addressData,
//               addressLine: e.target.value,
//             })
//           }
//           className="border rounded px-2 py-1.5 md:col-span-2 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//         <input
//           placeholder="Locality"
//           value={addressData.locality}
//           onChange={(e) =>
//             setAddressData({
//               ...addressData,
//               locality: e.target.value,
//             })
//           }
//           className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//         <input
//           placeholder="City"
//           value={addressData.city}
//           onChange={(e) =>
//             setAddressData({
//               ...addressData,
//               city: e.target.value,
//             })
//           }
//           className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//         <input
//           placeholder="District"
//           value={addressData.district}
//           onChange={(e) =>
//             setAddressData({
//               ...addressData,
//               district: e.target.value,
//             })
//           }
//           className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//         <input
//           placeholder="State"
//           value={addressData.state}
//           onChange={(e) =>
//             setAddressData({
//               ...addressData,
//               state: e.target.value,
//             })
//           }
//           className="border rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
//         />

//       </div>

//       {/* Address Type */}
//       <div className="flex gap-4 mt-3 text-sm">

//         <label className="flex items-center gap-1">
//           <input
//             type="radio"
//             value="Home"
//             checked={addressData.addressType === "Home"}
//             onChange={(e) =>
//               setAddressData({
//                 ...addressData,
//                 addressType: e.target.value,
//               })
//             }
//           />
//           Home
//         </label>

//         <label className="flex items-center gap-1">
//           <input
//             type="radio"
//             value="Office"
//             checked={addressData.addressType === "Office"}
//             onChange={(e) =>
//               setAddressData({
//                 ...addressData,
//                 addressType: e.target.value,
//               })
//             }
//           />
//           Office
//         </label>

//       </div>

//       {/* Default */}
//       <label className="flex items-center gap-1 mt-2 text-sm">
//         <input
//           type="checkbox"
//           checked={addressData.isDefault}
//           onChange={(e) =>
//             setAddressData({
//               ...addressData,
//               isDefault: e.target.checked,
//             })
//           }
//         />
//         Default address
//       </label>

//       <div className="flex gap-2 mt-3">
//         <button onClick={() => setMode("view")}  className="px-3 py-1 border rounded hover:bg-gray-100">
//           Cancel
//         </button>
//         <button onClick={handleAddAddress} className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800">
//           {editingId ? "Update" : "Save"}
//         </button>
//       </div>

//     </div>
//   );
// }


//   // ===== ADDRESS LIST =====
//   return (
//     <div className="space-y-3">
// {addresses.filter(Boolean).map((addr) => (

//   <div
//     key={addr._id}
//     className="relative border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition text-sm"
//   >

//     {/* DEFAULT BADGE — TOP RIGHT */}
//     {addr.isDefault ?
//       <span className="absolute top-2 right-2 text-[10px] bg-white px-2 py-0.5 rounded border">
//         Default Address
//       </span>
//     :<button
//   onClick={async () => {
//   await dispatch(updateAddress({
//     id: addr._id,
//     data: { ...addr, isDefault: true }
//   })).unwrap();

//   setRefreshAddresses(prev => prev + 1);
// }}
//   className="text-xs absolute top-2 right-2 text-[10px] bg-white px-2 py-0.5 rounded border"
// >
//   Make Default
// </button>}

//     {/* ADDRESS CONTENT */}
//     <p className="font-medium">
//       {addr.name}
//     </p>

//     <p className="text-gray-600 text-xs">
//       {addr.houseNumber}, {addr.addressLine}
//     </p>

//     <p className="text-gray-600 text-xs">
//       {addr.city}, {addr.state} — {addr.pincode}
//     </p>

//     <p className="text-gray-600 text-xs mt-1">
//       Phone: {addr.phone}
//     </p>

//     {/* ACTION BUTTONS — BOTTOM RIGHT */}
//       <span className="absolute bottom-2 right-2 text-[10px] bg-white px-2 py-0.5 rounded">

//       {/* EDIT */}
//       <button
//         className="p-1 rounded hover:bg-white"
//        onClick={() => {
//           setAddressData({
//           name: addr.name || "",
//           phone: addr.phone || "",
//           pincode: addr.pincode || "",
//           houseNumber: addr.houseNumber || "",
//           addressLine: addr.addressLine || "",
//           locality: addr.locality || "",
//           city: addr.city || "",
//           district: addr.district || "",
//           state: addr.state || "",
//           addressType: addr.addressType || "Home",
//           isDefault: addr.isDefault || false,
//         });
//           setEditingId(addr._id); // mark editing
//           setMode("add");         // open form
//         }}
//       >
//         <img src={edit} className="w-4 h-4" alt="edit" />
//       </button>

//       {/* DELETE */}
//       <button className="p-1 rounded hover:bg-white"
//         onClick={() => handleDeleteAddress(addr._id)}
//       >
//         <Trash2 size={16} className="text-red-500" />
//       </button>
// </span>

//   </div>
// ))}

//       <button
//         onClick={() => setMode("add")}
//         className="w-full py-2 text-sm border border-dashed rounded-lg hover:bg-gray-50"
//       >
//         + Add Address
//       </button>

//     </div>
//   );
// };
 
//   return (

//     <div className="min-h-screen bg-[#f3f3f3] mt-15">

//       <div className="bg-[#1E293B] shadow px-10 py-5 flex justify-between">
//         <h1 className="text-2xl font-semibold text-white">My Account</h1>
//         <button   onClick={() => setLogoutModal(true)} className="flex items-center gap-2 text-white cursor-pointer" >
//           <LogOut size={18} /> Logout
//         </button>
//       </div>

//       <div className="flex max-w-7xl mx-auto mt-8 gap-8 px-6">
//         <div className="w-64 bg-white rounded-xl shadow p-5 h-fit">
//           <div className="flex items-center gap-3 mb-6">
//             <img src={user?.avatar || profile} className="w-12 h-12 rounded-full"/>
//             <div>
//               <p className="font-semibold">{user?.name}</p>
//               <p className="text-xs text-gray-500">Account</p>
//             </div>
//           </div>
//           <SidebarItem  icon={<ArrowLeftRight />}  label="Transactions"  onClick={() => navigate("/transactions")}/>
//           <SidebarItem icon={<List />} label="My Orders" onClick={() => navigate("/userorders")}/>
//           <SidebarItem icon={<Wallet  />} label="My Wallet" onClick={() => navigate("/wallet")}/>
//           {/* <SidebarItem icon={<Home />} label="Addresses" /> */}
//           <SidebarItem icon={<Lock />} label="Security" onClick={() => setShowSecurity(!showSecurity)} />
//           {showSecurity && (
//           <div className="ml-10 mt-2">

//             <div
//               className="cursor-pointer py-1.5 text-sm text-gray-700 hover:text-black hover:underline transition"
//               onClick={() => setpasswordmodal(true)}
//             >
//               Change Password
//             </div>

//             {/* You can add more options */}
//             {/* <div>Two Factor Auth</div> */}

//           </div>
//         )}

//         </div>

//         {/* MAIN CONTENT */}
//         <div className="flex-1 space-y-6">

//           {/* PROFILE CARD */}
//           {user && (
//             <div className="relative bg-white rounded-xl shadow p-6 flex items-center gap-6">
//               <img src={user.avatar || profile}  className="w-20 h-20 rounded-full" />
//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold">{user.name}</h2>
//                 <p className="text-gray-600">{user.email}</p>
//                 <p className="text-gray-600">+{user.phoneno}</p>
//               </div>
//               <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
//                 onClick={() => {
//                   setFormData({
//                     name: user.name,
//                     email: user.email,
//                     phoneno: user.phoneno,
//                   });
//                   setprofileMode(true);
//                 }}>
//                   <img src={edit} className="w-4 h-4" alt="" />

//                </button>
               
               
//             </div>
//           )}

//           {/* ADDRESS SECTION */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">
//               Saved Addresses
//             </h2>

//             {renderAddressContent()}
//           </div>
//         </div>
//       </div>

//     {/* ================= EDIT PROFILE MODAL ================= */}
//     {user && profileMode && (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

//         <div className="bg-white rounded-xl w-[400px] p-8">

//           <h3 className="text-xl font-medium mb-6">Edit Profile</h3>

//           <div className="flex flex-col gap-4">

//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               className="border rounded px-4 py-2"
//               placeholder="Name"
//             />

//             <input
//               type="text"
//               value={formData.phoneno}
//               onChange={(e) =>
//                 setFormData({ ...formData, phoneno: e.target.value })
//               }
//               className="border rounded px-4 py-2"
//               placeholder="Phone number"
//             />

//           </div>

//           <div className="flex justify-center gap-4 mt-6">

//             <button
//               onClick={() => setprofileMode(false)}
//               className="border px-6 py-2 rounded"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleUpdateProfile}
//               className="bg-black text-white px-6 py-2 rounded"
//             >
//               Save
//             </button>

//           </div>

//         </div>
//       </div>
//     )}
// {/* ===== CHANGE PASSWORD MODAL ===== */}


// {passwordmodal && (
//   <div
//     className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//     onClick={() => setpasswordmodal(false)}
//   >

//     {/* Modal Box */}
//     <div
//       className="bg-white w-[420px] rounded-2xl shadow-xl p-8 relative"
//       onClick={(e) => e.stopPropagation()}
//     >

//       {/* Close Button */}
//       <button
//         onClick={() => setpasswordmodal(false)}
//         className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
//       >
//         ✕
//       </button>

//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Change Password
//       </h2>

//       <div className="flex flex-col gap-4">

//         {/* Current Password */}
//         <input
//           type="password"
//           placeholder="Current Password"
//           value={oldPassword}
//           onChange={(e) => setOldPassword(e.target.value)}
//           className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
//         />

//         {/* New Password */}
//         <input
//           type="password"
//           placeholder="New Password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
//         />

//         {/* Confirm Password */}
//         <input
//           type="password"
//           placeholder="Confirm New Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
//         />

//       </div>

//       {/* Forgot Password Link */}
//       <div className="text-right mt-2">
//         <button
//           onClick={() => {
//             setpasswordmodal(false);
//             navigate("/forgot-password");
//           }}
//           className="text-sm text-gray-600 hover:underline"
//         >
//           Forgot password?
//         </button>
//       </div>

//       {/* Message */}
//       {message && (
//         <p className="text-center text-sm text-red-500 mt-3">
//           {message}
//         </p>
//       )}

//       {/* Buttons */}
//       <div className="flex justify-end gap-3 mt-6">

//         <button
//           onClick={() => setpasswordmodal(false)}
//           className="px-5 py-2 rounded-lg border hover:bg-gray-100"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={changePassword}
//           className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
//         >
//           Update Password
//         </button>

//       </div>

//     </div>
//   </div>
// )}




// {logoutModal && (
//   <div
//     className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//     onClick={() => setLogoutModal(false)}
//   >
//     <div
//       className="bg-white w-[380px] rounded-2xl shadow-xl p-6 text-center"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <h2 className="text-xl font-semibold mb-4">
//         Confirm Logout
//       </h2>

//       <p className="text-gray-600 mb-6">
//         Are you sure you want to logout?
//       </p>

//       <div className="flex justify-center gap-4">
//         <button
//           onClick={() => setLogoutModal(false)}
//           className="px-5 py-2 rounded-lg border hover:bg-gray-100"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={confirmLogout}
//           className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//   </div>
// );
// }


// const InputSmall = ({ label, className = "", ...props }) => (
//   <div className={className}>
//     <p className="text-xs font-medium mb-1">{label}</p>
//     <input
//       {...props}
//       className="w-full border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-black"
//     />
//   </div>
// );



// const SidebarItem = ({ icon, label,onClick }) => (
//    <button  onClick={onClick}
//    className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer">
//     {icon}
//     <span className="text-sm">{label}</span>
 
//   </button>
// );



// export default ProfilePage;
