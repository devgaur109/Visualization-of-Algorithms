#include<iostream>
#include<stdlib.h>
#include<bits/stdc++.h>

using namespace std;

vector<pair<int,int>> ss_predictor(string RNA_sequence)
{
    int n = RNA_sequence.length();
    vector<pair<int,int>> OPT[n+1][n+1];

    for(int i = 1; i<=n; i++)
    {
        for(int j = i; j<=n && j<=i+4; j++)
        {
            OPT[i][j] = {};
        }
    }

    for(int k = 5; k<=n-1; k++)
    {
        for(int i = 1; i<=n-k ; i++)
        {
            int j = i + k;
            char jth_base = RNA_sequence[j-1];

            vector<pair<int,int>> first_arg = OPT[i][j-1];
            int first_arg_size = first_arg.size();

            vector<pair<int,int>> sec_arg;
            int sec_arg_size = 0;

            for(int t = i; t<=j-5; t++)
            {
                char tth_base = RNA_sequence[t-1];
                if((tth_base == 'A' && jth_base == 'U') || (tth_base == 'U' && jth_base == 'A') || (tth_base == 'C' && jth_base == 'G') || (tth_base == 'G' && jth_base == 'C'))
                {
                    pair<int,int> curr_bp = make_pair(t,j);
                    vector<pair<int,int>> curr_sec_arg = {};
                    curr_sec_arg.push_back(curr_bp);
                    if(t>i)
                    {
                        curr_sec_arg.insert(curr_sec_arg.end(), OPT[i][t-1].begin(), OPT[i][t-1].end());
                    }

                    curr_sec_arg.insert(curr_sec_arg.end(),OPT[t+1][j-1].begin(),OPT[t+1][j-1].end());

                    if(curr_sec_arg.size()>sec_arg_size)
                    {
                        sec_arg = curr_sec_arg;
                        sec_arg_size = curr_sec_arg.size();
                    }
                }
            }

            if(first_arg_size>=sec_arg_size)
            {
                OPT[i][j] = first_arg;
            }
            else
            {
                OPT[i][j] = sec_arg;
            }
        }
    }
    
    return OPT[1][n];
}

int main()
{
    string RNA_sequence;
    cin>>RNA_sequence;

    vector<pair<int,int>> max_base_pairs = ss_predictor(RNA_sequence);
    cout<<"Maximum base pairs = "<<max_base_pairs.size()<<endl;
    for (int i = 0; i<max_base_pairs.size(); i++)
    {
        cout<<max_base_pairs[i].first<<" "<<max_base_pairs[i].second<<endl;
    }
}