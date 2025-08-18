"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Edit3,
  LogOut,
} from "lucide-react";
import { signOut } from "@/auth";
import { LogoutButton } from "@/components/logout-button";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@zitaonyeka.org",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Dedicated administrator working to support the Zita Onyeka Foundation's mission of community empowerment and social change.",
    role: "Administrator",
    joinDate: "January 15, 2020",
    lastLogin: "2 hours ago",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    eventReminders: true,
  });

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
    console.log("Profile saved:", profileData);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await signOut();
  };

  const stats = [
    {
      title: "Blog Posts Created",
      value: "18",
      description: "This year",
      icon: Edit3,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Events Managed",
      value: "12",
      description: "This year",
      icon: Calendar,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Team Members Added",
      value: "8",
      description: "This year",
      icon: User,
      gradient: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Profile" breadcrumbs={[{ label: "Profile" }]} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt="Admin User"
                />
                <AvatarFallback className="text-lg">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">
                {profileData.firstName} {profileData.lastName}
              </CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <Shield className="h-4 w-4" />
                {profileData.role}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {profileData.joinDate}</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center">
                Last login: {profileData.lastLogin}
              </Badge>
              <LogoutButton className="w-full text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors py-2 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </LogoutButton>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Activity Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <Card
                key={stat.title}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and bio.
                </CardDescription>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Button variant="outline">Update Password</Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Label>Email Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("emailNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get push notifications on your device
                  </p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("pushNotifications", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly analytics reports
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("weeklyReports", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders about upcoming events
                  </p>
                </div>
                <Switch
                  checked={notifications.eventReminders}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("eventReminders", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
