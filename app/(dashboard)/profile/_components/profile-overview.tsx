import { Calendar, LogOut, Mail, MapPin, Phone, Shield } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { format, formatDistanceToNow } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/logout-button";
import { ProfileImage } from "./profile-image";

export const ProfileOverview = ({ profile }: { profile: IUser }) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader className="text-center">
        <ProfileImage imgUrl={profile?.image!} />
        <div className="space-y-1">
          <CardTitle className="text-xl">{capitalize(profile?.name)}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-1">
            <Shield className="h-4 w-4" />
            {capitalize(profile?.role)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{profile?.email}</span>
          </div>
          {profile?.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.phone}</span>
            </div>
          )}
          {profile?.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              Joined {format(profile?.joinDate || new Date(), "MMMM d, yyyy")}
            </span>
          </div>
        </div>
        <Separator />
        <div className="gap-y-2 flex flex-col">
          {profile?.lastLogin && (
            <Badge variant="outline" className="w-full justify-center">
              Last login:{" "}
              {formatDistanceToNow(profile?.lastLogin, {
                addSuffix: true,
              })}
            </Badge>
          )}

          <LogoutButton>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-50/10 dark:hover:text-white transition-all  hover:text-red-700 hover:border-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </LogoutButton>
        </div>
      </CardContent>
    </Card>
  );
};
