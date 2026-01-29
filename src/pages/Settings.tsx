import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette } from 'lucide-react'

export default function Settings() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your application preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="flex-1 overflow-auto pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Settings */}
          <div className="bg-[#1a1f37] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <User className="text-white" size={20} />
                </div>
                <h2 className="text-white font-bold text-lg">Account Settings</h2>
              </div>
              <p className="text-gray-400 text-sm">Manage your account and profile</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Ron"
                  className="w-full bg-black/40 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="info@zipp3d.com"
                  className="w-full bg-black/40 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Organization</label>
                <input
                  type="text"
                  defaultValue="Myrex"
                  className="w-full bg-black/40 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/30 hover:scale-105">
                Save Changes
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#1a1f37] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Bell className="text-white" size={20} />
                </div>
                <h2 className="text-white font-bold text-lg">Notifications</h2>
              </div>
              <p className="text-gray-400 text-sm">Configure notification preferences</p>
            </div>
            <div className="p-6 space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="text-white font-medium mb-1">Email Notifications</div>
                  <div className="text-gray-400 text-sm">Receive updates via email</div>
                </div>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="text-white font-medium mb-1">Maintenance Alerts</div>
                  <div className="text-gray-400 text-sm">Get notified of scheduled maintenance</div>
                </div>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="text-white font-medium mb-1">System Updates</div>
                  <div className="text-gray-400 text-sm">Platform updates and announcements</div>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#1a1f37] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                  <Shield className="text-white" size={20} />
                </div>
                <h2 className="text-white font-bold text-lg">Security</h2>
              </div>
              <p className="text-gray-400 text-sm">Manage security settings</p>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full text-left px-4 py-3 bg-black/40 hover:bg-black/60 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all">
                <div className="text-white font-medium mb-1">Change Password</div>
                <div className="text-gray-400 text-sm">Update your password</div>
              </button>

              <button className="w-full text-left px-4 py-3 bg-black/40 hover:bg-black/60 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all">
                <div className="text-white font-medium mb-1">Two-Factor Authentication</div>
                <div className="text-gray-400 text-sm">Add an extra layer of security</div>
              </button>

              <button className="w-full text-left px-4 py-3 bg-black/40 hover:bg-black/60 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all">
                <div className="text-white font-medium mb-1">Active Sessions</div>
                <div className="text-gray-400 text-sm">Manage your active sessions</div>
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-[#1a1f37] rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Palette className="text-white" size={20} />
                </div>
                <h2 className="text-white font-bold text-lg">Appearance</h2>
              </div>
              <p className="text-gray-400 text-sm">Customize the look and feel</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Theme</label>
                <select className="w-full bg-black/40 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                  <option>Dark (Default)</option>
                  <option>Light</option>
                  <option>Auto</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Accent Color</label>
                <div className="flex gap-3">
                  {['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-red-600', 'bg-yellow-600'].map((color, i) => (
                    <button
                      key={i}
                      className={`w-10 h-10 ${color} rounded-lg hover:scale-110 transition-transform ${i === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1f37]' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 bg-red-500/10 rounded-xl border border-red-500/30 overflow-hidden">
          <div className="p-6 border-b border-red-500/30">
            <h2 className="text-red-400 font-bold text-lg">Danger Zone</h2>
            <p className="text-red-400/70 text-sm">Irreversible actions</p>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all">
              <div className="text-red-400 font-medium mb-1">Clear All Data</div>
              <div className="text-red-400/70 text-sm">Remove all marks, media, and events</div>
            </button>

            <button className="w-full text-left px-4 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all">
              <div className="text-red-400 font-medium mb-1">Delete Account</div>
              <div className="text-red-400/70 text-sm">Permanently delete your account</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}